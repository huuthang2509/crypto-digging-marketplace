
alter table "public"."heros" rename column "statistic" to "statistics";

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros" add column "heroStatus" text
--  null default 'ready';

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros" add column "restTime" timestamptz
--  null;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros" add column "currentStamina" numeric
--  null default '0';

alter table "public"."heros" alter column "CDGPrice" drop not null;
alter table "public"."heros" add column "CDGPrice" numeric;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- UPDATE heros_bases SET "animationSpeedRange"='[1,3]', "moveSpeedRange"='[1,3]', "gemEarnRange"='[1,3]', "staminaRange"='[1,3]' WHERE type='common';
--
-- UPDATE heros_bases SET "animationSpeedRange"='[3,5]', "moveSpeedRange"='[3,5]', "gemEarnRange"='[3,5]', "staminaRange"='[3,5]' WHERE type='rare';
--
-- UPDATE heros_bases SET "animationSpeedRange"='[5,10]', "moveSpeedRange"='[5,10]', "gemEarnRange"='[5,10]', "staminaRange"='[5,10]' WHERE type='epic';
--
-- UPDATE heros_bases SET "animationSpeedRange"='[9,15]', "moveSpeedRange"='[9,15]', "gemEarnRange"='[9,15]', "staminaRange"='[9,15]' WHERE type='legend';

alter table "public"."heros" alter column "maxEarnSpeedLevel" drop not null;
alter table "public"."heros" add column "maxEarnSpeedLevel" numeric;

alter table "public"."heros" alter column "earnSpeedUpgrades" drop not null;
alter table "public"."heros" add column "earnSpeedUpgrades" jsonb;

alter table "public"."heros" alter column "maxAnimationSpeedLevel" drop not null;
alter table "public"."heros" add column "maxAnimationSpeedLevel" numeric;

alter table "public"."heros" alter column "animationSpeedUpgrades" drop not null;
alter table "public"."heros" add column "animationSpeedUpgrades" jsonb;

alter table "public"."heros" alter column "maxMoveSpeedLevel" drop not null;
alter table "public"."heros" add column "maxMoveSpeedLevel" numeric;

alter table "public"."heros" alter column "moveSpeedUpgrades" drop not null;
alter table "public"."heros" add column "moveSpeedUpgrades" jsonb;

alter table "public"."heros_bases" alter column "gemEarn" drop not null;
alter table "public"."heros_bases" add column "gemEarn" numeric;

alter table "public"."heros_bases" alter column "moveSpeed" drop not null;
alter table "public"."heros_bases" add column "moveSpeed" numeric;

alter table "public"."heros_bases" alter column "animationSpeed" drop not null;
alter table "public"."heros_bases" add column "animationSpeed" numeric;

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros_bases" add column "staminaRange" jsonb
--  null default jsonb_build_array();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros_bases" add column "gemEarnRange" jsonb
--  null default jsonb_build_array();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros_bases" add column "moveSpeedRange" jsonb
--  null default jsonb_build_array();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros_bases" add column "animationSpeedRange" jsonb
--  null default jsonb_build_array();

-- Could not auto-generate a down migration.
-- Please write an appropriate down migration for the SQL below:
-- alter table "public"."heros" add column "statistics" jsonb
--  null default jsonb_build_object();
