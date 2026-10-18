-- Up Migration
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  google_sub varchar UNIQUE,
  is_guest boolean NOT NULL DEFAULT false
);

ALTER TABLE study_records RENAME COLUMN user_id TO owner_email;
ALTER TABLE study_records ADD COLUMN user_id bigint REFERENCES users (id);
ALTER TABLE study_records ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE study_records DROP COLUMN owner_email;

-- Down Migration
ALTER TABLE study_records ADD COLUMN owner_email varchar;
ALTER TABLE study_records ALTER COLUMN owner_email SET NOT NULL;
ALTER TABLE study_records DROP COLUMN user_id;
ALTER TABLE study_records RENAME COLUMN owner_email TO user_id;

DROP TABLE users;
