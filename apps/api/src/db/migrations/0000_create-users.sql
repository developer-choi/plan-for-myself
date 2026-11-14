CREATE TABLE "users" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"google_sub" varchar,
	"is_guest" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_google_sub_key" UNIQUE("google_sub"),
	CONSTRAINT "users_is_guest_matches_google_sub" CHECK ("users"."is_guest" = ("users"."google_sub" IS NULL))
);
