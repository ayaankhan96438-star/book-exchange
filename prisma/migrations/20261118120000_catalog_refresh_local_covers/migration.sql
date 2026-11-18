-- Remove the three requested titles from the public catalogue.
-- Detach reservation-book rows first so the book records can be removed safely.
DELETE FROM "ReservationBook"
WHERE "bookId" IN (
  SELECT "id"
  FROM "Book"
  WHERE lower(btrim("title")) IN (
    'india after gandhi',
    'deep work',
    'the 7 habits of highly effective people'
  )
);

DELETE FROM "Book"
WHERE lower(btrim("title")) IN (
  'india after gandhi',
  'deep work',
  'the 7 habits of highly effective people'
);

-- Add the two requested books if they are not already present.
INSERT INTO "Book" (
  "id", "isbn", "title", "author", "genre", "condition", "coverUrl", "status"
)
SELECT
  'seed-9780399179006', '9780399179006', 'Black Holes', 'Stephen Hawking',
  'Science & Technology', 'Very_Good', '/books/black-holes.jpg', 'available'
WHERE NOT EXISTS (
  SELECT 1 FROM "Book" WHERE "isbn" = '9780399179006' OR lower("title") = 'black holes'
)
ON CONFLICT ("id") DO UPDATE SET
  "isbn" = EXCLUDED."isbn",
  "title" = EXCLUDED."title",
  "author" = EXCLUDED."author",
  "genre" = EXCLUDED."genre",
  "condition" = EXCLUDED."condition",
  "coverUrl" = EXCLUDED."coverUrl";

INSERT INTO "Book" (
  "id", "isbn", "title", "author", "genre", "condition", "coverUrl", "status"
)
SELECT
  'seed-9789363958128', '9789363958128', 'White Nights', 'Fyodor Dostoevsky',
  'Fiction', 'Very_Good', '/books/white-nights.jpg', 'available'
WHERE NOT EXISTS (
  SELECT 1 FROM "Book" WHERE "isbn" = '9789363958128' OR lower("title") = 'white nights'
)
ON CONFLICT ("id") DO UPDATE SET
  "isbn" = EXCLUDED."isbn",
  "title" = EXCLUDED."title",
  "author" = EXCLUDED."author",
  "genre" = EXCLUDED."genre",
  "condition" = EXCLUDED."condition",
  "coverUrl" = EXCLUDED."coverUrl";

-- Keep existing matching rows in sync when the books were already in the database.
UPDATE "Book"
SET "isbn" = '9780399179006', "author" = 'Stephen Hawking',
    "genre" = 'Science & Technology', "coverUrl" = '/books/black-holes.jpg'
WHERE lower("title") = 'black holes' OR "isbn" = '9780399179006';

UPDATE "Book"
SET "isbn" = '9789363958128', "author" = 'Fyodor Dostoevsky',
    "genre" = 'Fiction', "coverUrl" = '/books/white-nights.jpg'
WHERE lower("title") = 'white nights' OR "isbn" = '9789363958128';
