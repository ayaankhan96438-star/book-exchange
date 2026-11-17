const cleanValue = (value: string | undefined, fallback: string) => {
  const candidate = value?.trim();
  if (!candidate) return fallback;
  if (/^(?:your\b|placeholder\b|\[|page)/i.test(candidate)) return fallback;
  if (/your-domain|your-render-service|your-handle/i.test(candidate)) return fallback;
  return candidate;
};

const digitsOnly = (value: string | undefined) => (value ?? "").replace(/\D/g, "");
const rawWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const normalizedWhatsApp = /x/i.test(rawWhatsApp ?? "") ? "" : digitsOnly(rawWhatsApp);

/** Public business details. Every fallback is a real launch value, not a placeholder. */
export const BRAND_NAME = cleanValue(process.env.NEXT_PUBLIC_BRAND_NAME, "Book Exchange");
export const AREA = cleanValue(process.env.NEXT_PUBLIC_AREA, "Krishna Nagar, Delhi");
export const CITY = cleanValue(process.env.NEXT_PUBLIC_CITY, "Delhi");
export const ADDRESS = cleanValue(process.env.NEXT_PUBLIC_ADDRESS, "H6, Krishna Nagar, Delhi 110051");
export const WHATSAPP_NUMBER = normalizedWhatsApp.length >= 10 ? normalizedWhatsApp : "919643833192";
const rawPhone = process.env.NEXT_PUBLIC_PHONE_NUMBER;
const normalizedPhone = /x/i.test(rawPhone ?? "") ? "" : digitsOnly(rawPhone);
export const PHONE_NUMBER = normalizedPhone.length >= 10 ? `+${normalizedPhone}` : `+${WHATSAPP_NUMBER}`;

const instagramCandidate = cleanValue(
  process.env.NEXT_PUBLIC_INSTAGRAM || process.env.NEXT_PUBLIC_INSTAGRAM_URL,
  "https://www.instagram.com/whoisbombastic/",
);
export const INSTAGRAM_URL = (() => {
  try {
    const parsed = new URL(instagramCandidate);
    return (parsed.hostname.toLowerCase() === "instagram.com" || parsed.hostname.toLowerCase().endsWith(".instagram.com")) && parsed.pathname.replace(/\//g, "").length > 0
      ? instagramCandidate
      : "https://www.instagram.com/whoisbombastic/";
  } catch {
    return "https://www.instagram.com/whoisbombastic/";
  }
})();
export const SITE_URL = cleanValue(
  process.env.NEXT_PUBLIC_SITE_URL || process.env.RENDER_EXTERNAL_URL,
  "",
);
export const OWNER_NAME = cleanValue(process.env.NEXT_PUBLIC_OWNER_NAME, "The Book Exchange Team");
export const ABOUT = cleanValue(
  process.env.NEXT_PUBLIC_ABOUT,
  "A small, home-run non-fiction book exchange in Krishna Nagar, Delhi.",
);

export const EXCHANGE_FEE_RUPEES = 100;
export const MAX_BOOKS_PER_EXCHANGE = 10;
export const RESERVATION_HOURS = 48;
export const DEFAULT_WHATSAPP_MESSAGE =
  "Hi! I want to know about the book exchange. Please tell me how it works.";
