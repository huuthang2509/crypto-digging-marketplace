
-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros" add column "earnFrom" Text
--  null default 'buy';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."boxes" add column "earnFrom" text
--  null default 'buy';

alter table "public"."game_plays" alter column "status" set default 'action'::text;

alter table "public"."game_plays" drop constraint "game_plays_createdBy_fkey2";

ALTER TABLE "public"."game_plays" ALTER COLUMN "gameStatus" drop default;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."game_plays" add column "gameStatus" text
--  null;

DROP TABLE "public"."game_plays";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."users" add column "CDC" numeric
--  null default '0';

ALTER TABLE "public"."users" ALTER COLUMN "CDG" drop default;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."users" add column "CDG" numeric
--  null;
