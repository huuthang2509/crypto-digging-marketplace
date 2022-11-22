
alter table "public"."marketplace" add column "status" text
 null default 'active';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."marketplace" add column "id" uuid
 null default gen_random_uuid();

BEGIN TRANSACTION;
ALTER TABLE "public"."marketplace" DROP CONSTRAINT "marketplace_pkey";

ALTER TABLE "public"."marketplace"
    ADD CONSTRAINT "marketplace_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;

alter table "public"."marketplace" drop column "heroId" cascade;

alter table "public"."marketplace" add column "refId" uuid
 null;

alter table "public"."marketplace" add column "refType" text
 null;

alter table "public"."marketplace" drop column "itemType" cascade;

alter table "public"."boxes" add column "readyToUse" boolean
 null default 'true';
