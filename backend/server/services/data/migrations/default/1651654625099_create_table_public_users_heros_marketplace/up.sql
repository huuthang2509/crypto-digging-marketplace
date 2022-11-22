
CREATE TABLE "public"."users" ("id" uuid NOT NULL, "username" text, "password" text, "status" text DEFAULT 'active', "createdAt" timestamptz DEFAULT now(), "updatedAt" timestamptz DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_users_updatedAt"
BEFORE UPDATE ON "public"."users"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_users_updatedAt" ON "public"."users" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';

DROP table "public"."test";

CREATE TABLE "public"."heros" ("id" uuid NOT NULL, "status" text DEFAULT 'active', "createdAt" timestamptz DEFAULT now(), "updatedAt" timestamptz DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "tokenId" text NOT NULL, "CDGPrice" numeric NOT NULL, "name" text NOT NULL, "image" text NOT NULL, "quality" text NOT NULL, "moveSpeedUpgrades" jsonb, "maxMoveSpeedLevel" numeric, "animationSpeedUpgrades" jsonb, "maxAnimationSpeedLevel" numeric, "earnSpeedUpgrades" jsonb, "maxEarnSpeedLevel" numeric, "ownerId" uuid, PRIMARY KEY ("id") , FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_heros_updatedAt"
BEFORE UPDATE ON "public"."heros"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_heros_updatedAt" ON "public"."heros" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';

CREATE TABLE "public"."users_heros" ("heroId" uuid NOT NULL, "ownerId" uuid NOT NULL, "isOnMarket" boolean DEFAULT false, PRIMARY KEY ("heroId","ownerId") );

alter table "public"."users_heros" add column "earnFrom" text
 null;

CREATE TABLE "public"."marketplace" ("ownerId" uuid NOT NULL, "heroId" uuid NOT NULL, "CDGPrice" numeric NOT NULL, "saleStatus" text NOT NULL DEFAULT 'on_market', "itemType" text NOT NULL DEFAULT 'hero', PRIMARY KEY ("ownerId","heroId") , FOREIGN KEY ("heroId") REFERENCES "public"."heros"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);

alter table "public"."marketplace" add column "createdAt" timestamptz
 null default now();

alter table "public"."marketplace" add column "updatedAt" timestamptz
 null default now();

alter table "public"."marketplace" add column "createdBy" uuid
 null;

alter table "public"."marketplace" add column "updatedBy" UUID
 null;

alter table "public"."users" add column "walletAddress" text
 null;
