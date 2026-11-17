-- The initial migration already creates Book_genre_idx and Reservation_status_expiresAt_idx.
-- Add the standalone Book.status index requested for simple status lookups.
CREATE INDEX IF NOT EXISTS "Book_status_idx" ON "Book"("status");
