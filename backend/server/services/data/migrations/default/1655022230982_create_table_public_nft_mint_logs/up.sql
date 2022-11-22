CREATE TABLE "public"."nft_mint_logs" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "status" text NOT NULL DEFAULT 'active', "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" uuid, "quality" text NOT NULL, "tokenId" text NOT NULL, "refId" uuid NOT NULL, "refType" text NOT NULL, "ownerId" UUID NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("ownerId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_nft_mint_logs_updatedAt"
BEFORE UPDATE ON "public"."nft_mint_logs"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_nft_mint_logs_updatedAt" ON "public"."nft_mint_logs" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
