
alter table "public"."boxes"
  add constraint "boxs_userId_fkey"
  foreign key (userId)
  references "public"."users"
  (id) on update restrict on delete restrict;
alter table "public"."boxes" alter column "userId" drop not null;
alter table "public"."boxes" add column "userId" uuid;

alter table "public"."boxes" drop constraint "boxes_ownerId_fkey";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."boxes" add column "boxInfoCapture" jsonb
--  null default jsonb_build_object();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."boxes" add column "ownerId" uuid
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."boxes" add column "tokenId" text
--  null;

alter table "public"."boxes" alter column "CDGPriceCapture" drop not null;
alter table "public"."boxes" add column "CDGPriceCapture" numeric;
