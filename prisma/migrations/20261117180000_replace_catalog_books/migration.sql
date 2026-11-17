UPDATE "Book"
SET
  "title" = 'The Monk Who Sold His Ferrari',
  "author" = 'Robin Sharma',
  "genre" = 'Self Help',
  "isbn" = '9780062515674',
  "coverUrl" = 'https://covers.openlibrary.org/b/isbn/9780062515674-L.jpg'
WHERE "title" = 'Wings of Fire';

UPDATE "Book"
SET
  "title" = '400 Days',
  "author" = 'Chetan Bhagat',
  "genre" = 'Fiction',
  "isbn" = '9781542094054',
  "coverUrl" = 'https://covers.openlibrary.org/b/isbn/9781542094054-L.jpg'
WHERE "title" = 'Sapiens';
