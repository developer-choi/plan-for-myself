-- Up Migration
CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  google_sub varchar UNIQUE,
  is_guest boolean NOT NULL DEFAULT false
);

INSERT INTO users (google_sub) VALUES ('115732729082102798034');

ALTER TABLE study_records RENAME COLUMN user_id TO owner_email;
ALTER TABLE study_records ADD COLUMN user_id bigint REFERENCES users (id);
UPDATE study_records
SET user_id = (SELECT id FROM users WHERE google_sub = '115732729082102798034')
WHERE owner_email = 'forworkchoe@gmail.com';
-- 본인 이메일이 아닌 행이 있으면 user_id가 비어 여기서 실패하고 전체가 되돌려진다
ALTER TABLE study_records ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE study_records DROP COLUMN owner_email;

-- Down Migration
DO $$
BEGIN
  IF (SELECT count(*) FROM users) <> 1
    OR EXISTS (SELECT 1 FROM users WHERE google_sub IS DISTINCT FROM '115732729082102798034') THEN
    RAISE EXCEPTION '본인 외 사용자가 있어 기록을 본인 이메일로 되돌릴 수 없다';
  END IF;
END $$;

ALTER TABLE study_records ADD COLUMN owner_email varchar;
UPDATE study_records SET owner_email = 'forworkchoe@gmail.com';
ALTER TABLE study_records ALTER COLUMN owner_email SET NOT NULL;
ALTER TABLE study_records DROP COLUMN user_id;
ALTER TABLE study_records RENAME COLUMN owner_email TO user_id;

DROP TABLE users;
