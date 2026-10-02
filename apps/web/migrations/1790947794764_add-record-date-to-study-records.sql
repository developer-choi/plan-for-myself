-- Up Migration
ALTER TABLE study_records ADD COLUMN record_date date;
UPDATE study_records SET record_date = (to_timestamp(timestamp / 1000.0) AT TIME ZONE 'Asia/Seoul')::date;
ALTER TABLE study_records ALTER COLUMN record_date SET NOT NULL;
ALTER TABLE study_records ADD CONSTRAINT study_records_user_id_record_date_key UNIQUE (user_id, record_date);

-- Down Migration
ALTER TABLE study_records DROP CONSTRAINT study_records_user_id_record_date_key;
ALTER TABLE study_records DROP COLUMN record_date;
