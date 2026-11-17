CREATE TYPE "BookCondition" AS ENUM ('Good', 'Very_Good', 'Like_New');
CREATE TYPE "BookStatus" AS ENUM ('available', 'reserved', 'taken');
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'completed', 'cancelled', 'expired');

CREATE TABLE "Book" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "genre" TEXT NOT NULL,
  "condition" "BookCondition" NOT NULL,
  "coverUrl" TEXT NOT NULL,
  "status" "BookStatus" NOT NULL DEFAULT 'available',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Reservation" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "booksBringing" INTEGER NOT NULL,
  "status" "ReservationStatus" NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReservationBook" (
  "reservationId" TEXT NOT NULL,
  "bookId" TEXT NOT NULL,
  CONSTRAINT "ReservationBook_pkey" PRIMARY KEY ("reservationId", "bookId")
);

CREATE TABLE "Exchange" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "bookCount" INTEGER NOT NULL,
  "fee" INTEGER NOT NULL DEFAULT 100,
  CONSTRAINT "Exchange_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Book_status_createdAt_idx" ON "Book"("status", "createdAt");
CREATE INDEX "Book_genre_idx" ON "Book"("genre");
CREATE INDEX "Book_title_author_idx" ON "Book"("title", "author");
CREATE INDEX "Reservation_status_expiresAt_idx" ON "Reservation"("status", "expiresAt");
CREATE INDEX "Reservation_phone_idx" ON "Reservation"("phone");
CREATE INDEX "ReservationBook_bookId_idx" ON "ReservationBook"("bookId");
CREATE INDEX "Exchange_date_idx" ON "Exchange"("date");

ALTER TABLE "ReservationBook" ADD CONSTRAINT "ReservationBook_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReservationBook" ADD CONSTRAINT "ReservationBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
