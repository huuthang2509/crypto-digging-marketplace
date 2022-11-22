
CREATE TABLE "public"."heros_bases" ("type" text NOT NULL, "status" text NOT NULL DEFAULT 'active', "updatedAt" timestamptz NOT NULL DEFAULT now(), "createdAt" timestamptz NOT NULL DEFAULT now(), "animationSpeed" numeric NOT NULL, "moveSpeed" numeric NOT NULL, "gemEarn" numeric NOT NULL, PRIMARY KEY ("type") , UNIQUE ("type"));
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
CREATE TRIGGER "set_public_heros_bases_updatedAt"
BEFORE UPDATE ON "public"."heros_bases"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_heros_bases_updatedAt" ON "public"."heros_bases"
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';

alter table "public"."heros"
  add constraint "heros_quality_fkey"
  foreign key ("quality")
  references "public"."heros_bases"
  ("type") on update restrict on delete restrict;

INSERT INTO "heros_bases"("type","animationSpeed","moveSpeed","gemEarn") VALUES ('common',10,10,3);
INSERT INTO "heros_bases"("type","animationSpeed","moveSpeed","gemEarn") VALUES ('rare',10,10,3);
INSERT INTO "heros_bases"("type","animationSpeed","moveSpeed","gemEarn") VALUES ('epic',10,10,3);
INSERT INTO "heros_bases"("type","animationSpeed","moveSpeed","gemEarn") VALUES ('legend',10,10,3);
alter table "public"."heros" add column "imageAssetName" text
 null;

alter table "public"."heros" alter column "id" set default gen_random_uuid();

alter table "public"."heros" add column "readyToUse" boolean
 null default 'true';
