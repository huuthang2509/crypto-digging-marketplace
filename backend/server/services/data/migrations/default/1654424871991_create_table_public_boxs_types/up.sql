
CREATE TABLE "public"."boxes_types" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "CDGPrice" numeric NOT NULL, "img" text NOT NULL, "status" text NOT NULL DEFAULT 'active', "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" UUID, "commonRatio" numeric NOT NULL, "rareRatio" numeric NOT NULL, "epicRatio" numeric NOT NULL, "legendRatio" numeric NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_boxes_types_updatedAt"
BEFORE UPDATE ON "public"."boxes_types"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_boxes_types_updatedAt" ON "public"."boxes_types"
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."boxes_types" add column "boxType" text
 null;

CREATE TABLE "public"."boxes" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "status" text NOT NULL DEFAULT 'active', "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "isOpened" boolean NOT NULL DEFAULT false, "boxInfoId" uuid NOT NULL, "heroId" uuid, "userId" uuid NOT NULL, "CDGPriceCapture" numeric NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("heroId") REFERENCES "public"."heros"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_boxes_updatedAt"
BEFORE UPDATE ON "public"."boxes"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_boxes_updatedAt" ON "public"."boxes"
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."boxes"
  add constraint "boxes_boxInfoId_fkey"
  foreign key ("boxInfoId")
  references "public"."boxes_types"
  ("id") on update restrict on delete restrict;

DROP table "public"."users_heros";
