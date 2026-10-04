-- Up Migration
ALTER TABLE users ADD CONSTRAINT users_is_guest_matches_google_sub CHECK (is_guest = (google_sub IS NULL));

-- Down Migration
ALTER TABLE users DROP CONSTRAINT users_is_guest_matches_google_sub;
