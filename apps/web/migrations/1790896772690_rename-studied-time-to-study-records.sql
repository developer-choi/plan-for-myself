-- Up Migration
ALTER TABLE studied_time RENAME TO study_records;
ALTER TABLE study_records RENAME CONSTRAINT studied_time_pkey TO study_records_pkey;
ALTER SEQUENCE studied_time_pk_seq RENAME TO study_records_pk_seq;
ALTER TABLE study_records RENAME COLUMN fail_keywords TO fail_tags;

-- Down Migration
ALTER TABLE study_records RENAME COLUMN fail_tags TO fail_keywords;
ALTER SEQUENCE study_records_pk_seq RENAME TO studied_time_pk_seq;
ALTER TABLE study_records RENAME CONSTRAINT study_records_pkey TO studied_time_pkey;
ALTER TABLE study_records RENAME TO studied_time;
