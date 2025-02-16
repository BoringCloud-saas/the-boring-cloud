CREATE TABLE "change_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"access_token" varchar(255) NOT NULL,
	"changeLog" text NOT NULL,
	"datum" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "historyID" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "change_logs" ADD CONSTRAINT "change_logs_access_token_users_access_token_fk" FOREIGN KEY ("access_token") REFERENCES "public"."users"("access_token") ON DELETE no action ON UPDATE cascade;