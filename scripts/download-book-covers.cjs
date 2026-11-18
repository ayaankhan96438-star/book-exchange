#!/usr/bin/env node
/*
 * Downloads book covers from Google Books first, with Open Library as a fallback,
 * stores them under public/books, then rewrites each database Book.coverUrl to a
 * same-origin /books/... path. Also processes the sample-data manifest so that
 * fallback/demo books have their files locally available too.
 */
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = process.cwd();
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const contents = fs.readFileSync(file, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] in process.env) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}
loadEnvFile(path.join(projectRoot, ".env"));
loadEnvFile(path.join(projectRoot, ".env.local"));

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const publicBooksDir = path.join(projectRoot, "public", "books");
const manifestPath = path.join(projectRoot, "scripts", "book-cover-manifest.json");

function slugify(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "book";
}

function extensionFor(contentType, buffer) {
  const type = (contentType || "").split(";")[0].trim().toLowerCase();
  if (type === "image/jpeg" || type === "image/jpg" || (buffer[0] === 0xff && buffer[1] === 0xd8)) return ".jpg";
  if (type === "image/png" || (buffer[0] === 0x89 && buffer.toString("ascii", 1, 4) === "PNG")) return ".png";
  if (type === "image/webp" || (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP")) return ".webp";
  if (type === "image/avif") return ".avif";
  return null;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "User-Agent": "BookExchangeCoverSync/1.0" } });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

async function googleCoverUrl(book) {
  const queries = [];
  if (book.isbn) queries.push(`isbn:${book.isbn}`);
  queries.push(`intitle:${book.title} inauthor:${book.author}`);
  for (const query of queries) {
    try {
      const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=8`;
      const data = await fetchJson(url);
      const items = data.items || [];
      const expectedTitle = book.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const expectedAuthor = book.author.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const ranked = items.map((item) => {
        const info = item.volumeInfo || {};
        const title = String(info.title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
        const authors = (info.authors || []).join(" ").toLowerCase().replace(/[^a-z0-9]+/g, " ");
        const score = (title.includes(expectedTitle) || expectedTitle.includes(title) ? 3 : 0)
          + (authors.includes(expectedAuthor.split(" ").slice(-1)[0]) ? 1 : 0);
        return { item, score };
      }).sort((a, b) => b.score - a.score);
      for (const candidate of ranked) {
        const links = candidate.item.volumeInfo?.imageLinks;
        const image = links?.extraLarge || links?.large || links?.medium || links?.thumbnail || links?.smallThumbnail;
        if (image) {
          const parsed = new URL(image);
          parsed.protocol = "https:";
          parsed.searchParams.set("zoom", "2");
          return parsed.toString();
        }
      }
    } catch (error) {
      console.warn(`Google Books lookup issue for ${book.title}: ${error.message}`);
    }
  }
  return null;
}

async function openLibraryCoverUrl(book) {
  if (book.isbn) {
    const direct = `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(book.isbn)}-L.jpg?default=false`;
    try {
      const response = await fetch(direct, { method: "HEAD", redirect: "follow", headers: { "User-Agent": "BookExchangeCoverSync/1.0" } });
      if (response.ok && (response.headers.get("content-type") || "").includes("image")) return direct;
    } catch {}
  }
  try {
    const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}&limit=5`;
    const data = await fetchJson(searchUrl);
    const match = (data.docs || []).find((doc) => doc.cover_i);
    if (match) return `https://covers.openlibrary.org/b/id/${match.cover_i}-L.jpg?default=false`;
  } catch (error) {
    console.warn(`Open Library lookup issue for ${book.title}: ${error.message}`);
  }
  return null;
}

async function downloadImage(url) {
  const response = await fetch(url, { headers: { "User-Agent": "BookExchangeCoverSync/1.0" }, redirect: "follow" });
  if (!response.ok) throw new Error(`HTTP ${response.status} while downloading ${url}`);
  const contentType = response.headers.get("content-type") || "";
  const buffer = Buffer.from(await response.arrayBuffer());
  const extension = extensionFor(contentType, buffer);
  if (!extension || buffer.length < 1500) throw new Error(`Not a usable image (${contentType}, ${buffer.length} bytes)`);
  return { buffer, extension };
}

async function downloadForBook(book) {
  const slug = slugify(book.title);
  const existing = [".jpg", ".png", ".webp", ".avif"].map((ext) => ({ ext, file: path.join(publicBooksDir, `${slug}${ext}`) }))
    .find((entry) => fs.existsSync(entry.file) && fs.statSync(entry.file).size > 1500);
  if (existing) return `/books/${slug}${existing.ext}`;

  const candidates = [];
  const google = await googleCoverUrl(book);
  if (google) candidates.push(google);
  const openLibrary = await openLibraryCoverUrl(book);
  if (openLibrary && !candidates.includes(openLibrary)) candidates.push(openLibrary);

  let lastError = null;
  for (const url of candidates) {
    try {
      const image = await downloadImage(url);
      const filename = `${slug}${image.extension}`;
      fs.writeFileSync(path.join(publicBooksDir, filename), image.buffer);
      return `/books/${filename}`;
    } catch (error) {
      lastError = error;
      console.warn(`Cover download failed for ${book.title}: ${error.message}`);
    }
  }
  throw new Error(`No downloadable cover found for "${book.title}"${book.isbn ? ` (ISBN ${book.isbn})` : ""}${lastError ? `: ${lastError.message}` : ""}`);
}

async function main() {
  if (typeof fetch !== "function") throw new Error("This script needs Node.js 18 or newer (built-in fetch).");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing. Check the project's .env or .env.local file.");
  if (!fs.existsSync(manifestPath)) throw new Error(`Cover manifest is missing: ${manifestPath}`);
  fs.mkdirSync(publicBooksDir, { recursive: true });

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const databaseBooks = await prisma.book.findMany({ orderBy: [{ title: "asc" }] });
  const jobs = new Map();
  for (const item of manifest) jobs.set(`${item.isbn || ""}:${item.title.toLowerCase()}`, item);
  for (const book of databaseBooks) {
    const key = `${book.isbn || ""}:${book.title.toLowerCase()}`;
    jobs.set(key, { title: book.title, author: book.author, isbn: book.isbn || undefined, databaseId: book.id });
  }

  let completed = 0;
  const failures = [];
  for (const job of jobs.values()) {
    try {
      const coverUrl = await downloadForBook(job);
      if (job.databaseId) {
        await prisma.book.update({ where: { id: job.databaseId }, data: { coverUrl } });
      }
      const expectedSlug = slugify(job.title);
      for (const relative of ["src/lib/sample-data.ts", "prisma/seed.ts"]) {
        const file = path.join(projectRoot, relative);
        if (!fs.existsSync(file)) continue;
        const source = fs.readFileSync(file, "utf8");
        const updated = source.replaceAll(`/books/${expectedSlug}.jpg`, coverUrl);
        if (updated !== source) fs.writeFileSync(file, updated);
      }
      completed += 1;
      console.log(`Saved ${coverUrl} — ${job.title}`);
    } catch (error) {
      failures.push(error.message);
      console.error(`FAILED: ${error.message}`);
    }
  }

  console.log(`\nDownloaded/reused ${completed} of ${jobs.size} book covers.`);
  if (failures.length) {
    console.error("\nSome books still need cover images. Do not push/deploy until these are resolved:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
