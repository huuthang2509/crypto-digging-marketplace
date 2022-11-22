
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros" add column "readyToUse" boolean
--  null default 'true';

ALTER TABLE "public"."heros" ALTER COLUMN "id" drop default;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros" add column "imageAssetName" text
--  null;

alter table "public"."heros" drop constraint "heros_quality_fkey";

DROP TABLE "public"."heros_bases";
