
alter table "public"."marketplace" alter column "itemType" set default ''hero'::text';
alter table "public"."marketplace" alter column "itemType" drop not null;
alter table "public"."marketplace" add column "itemType" text;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."marketplace" add column "refType" text
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."marketplace" add column "refId" uuid
--  null;

alter table "public"."marketplace"
  add constraint "marketplace_heroId_fkey"
  foreign key (heroId)
  references "public"."heros"
  (id) on update restrict on delete restrict;
alter table "public"."marketplace" alter column "heroId" drop not null;
alter table "public"."marketplace" add column "heroId" uuid;

alter table "public"."marketplace" drop constraint "marketplace_pkey";
alter table "public"."marketplace"
    add constraint "marketplace_pkey"
    primary key ("ownerId", "heroId");

alter table "public"."marketplace" drop column "id" cascade
alter table "public"."marketplace" drop column "id";
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."marketplace" add column "status" text
--  null default 'active';
