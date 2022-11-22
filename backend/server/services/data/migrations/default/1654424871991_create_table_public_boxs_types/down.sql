
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- DROP table "public"."users_heros";

alter table "public"."boxs" drop constraint "boxs_boxInfoId_fkey";

DROP TABLE "public"."boxs";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."boxs_types" add column "boxType" text
--  null;

DROP TABLE "public"."boxs_types";
