CREATE TABLE "study_records" (
	"pk" serial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"record_date" date NOT NULL,
	"timestamp" bigint NOT NULL,
	"date_type" varchar NOT NULL,
	"studied_minutes" integer[] NOT NULL,
	"fail_tags" text[] NOT NULL,
	CONSTRAINT "study_records_user_id_record_date_key" UNIQUE("user_id","record_date")
);
--> statement-breakpoint
ALTER TABLE "study_records" ADD CONSTRAINT "study_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;