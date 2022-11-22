
alter table "public"."users" add column "CDG" numeric
 null;

alter table "public"."users" alter column "CDG" set default '0';

alter table "public"."users" add column "CDC" numeric
 null default '0';

CREATE TABLE "public"."game_plays" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "status" text NOT NULL DEFAULT 'action', "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "profitLevel" integer NOT NULL DEFAULT 0, "speedLevel" integer NOT NULL DEFAULT 0, "workerLevel" integer NOT NULL DEFAULT 0, "logs" jsonb NOT NULL DEFAULT jsonb_build_array(), PRIMARY KEY ("id") , FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updatedAt"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updatedAt" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_game_plays_updatedAt"
BEFORE UPDATE ON "public"."game_plays"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_game_plays_updatedAt" ON "public"."game_plays" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."game_plays" add column "gameStatus" text
 null;

alter table "public"."game_plays" alter column "gameStatus" set default 'created';

alter table "public"."game_plays"
  add constraint "game_plays_createdBy_fkey2"
  foreign key ("createdBy")
  references "public"."users"
  ("id") on update restrict on delete restrict;

alter table "public"."game_plays" alter column "status" set default 'active'::text;

alter table "public"."boxes" add column "earnFrom" text
 null default 'buy';

alter table "public"."heros" add column "earnFrom" Text
 null default 'buy';
