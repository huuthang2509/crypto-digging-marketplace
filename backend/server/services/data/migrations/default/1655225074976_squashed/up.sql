
alter table "public"."heros" add column "statistics" jsonb
 null default jsonb_build_object();

alter table "public"."heros_bases" add column "animationSpeedRange" jsonb
 null default jsonb_build_array();

alter table "public"."heros_bases" add column "moveSpeedRange" jsonb
 null default jsonb_build_array();

alter table "public"."heros_bases" add column "gemEarnRange" jsonb
 null default jsonb_build_array();

alter table "public"."heros_bases" add column "staminaRange" jsonb
 null default jsonb_build_array();

alter table "public"."heros_bases" drop column "animationSpeed" cascade;

alter table "public"."heros_bases" drop column "moveSpeed" cascade;

alter table "public"."heros_bases" drop column "gemEarn" cascade;

alter table "public"."heros" drop column "moveSpeedUpgrades" cascade;

alter table "public"."heros" drop column "maxMoveSpeedLevel" cascade;

alter table "public"."heros" drop column "animationSpeedUpgrades" cascade;

alter table "public"."heros" drop column "maxAnimationSpeedLevel" cascade;

alter table "public"."heros" drop column "earnSpeedUpgrades" cascade;

alter table "public"."heros" drop column "maxEarnSpeedLevel" cascade;

UPDATE heros_bases SET "animationSpeedRange"='[1,3]', "moveSpeedRange"='[1,3]', "gemEarnRange"='[1,3]', "staminaRange"='[1,3]' WHERE type='common';

UPDATE heros_bases SET "animationSpeedRange"='[3,5]', "moveSpeedRange"='[3,5]', "gemEarnRange"='[3,5]', "staminaRange"='[3,5]' WHERE type='rare';

UPDATE heros_bases SET "animationSpeedRange"='[5,10]', "moveSpeedRange"='[5,10]', "gemEarnRange"='[5,10]', "staminaRange"='[5,10]' WHERE type='epic';

UPDATE heros_bases SET "animationSpeedRange"='[9,15]', "moveSpeedRange"='[9,15]', "gemEarnRange"='[9,15]', "staminaRange"='[9,15]' WHERE type='legend';

alter table "public"."heros" drop column "CDGPrice" cascade;

alter table "public"."heros" add column "currentStamina" numeric
 null default '0';

alter table "public"."heros" add column "restTime" timestamptz
 null;

alter table "public"."heros" add column "heroStatus" text
 null default 'ready';

alter table "public"."heros" rename column "statistics" to "statistic";
