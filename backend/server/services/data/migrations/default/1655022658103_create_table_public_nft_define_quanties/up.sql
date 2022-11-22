CREATE TABLE "public"."nft_define_quanties" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "status" text NOT NULL DEFAULT 'active', "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" Timestamp NOT NULL DEFAULT now(), "refType" text NOT NULL, "totalSuply" integer NOT NULL, "totalMint" integer NOT NULL, "quality" text NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_nft_define_quanties_updatedAt"
BEFORE UPDATE ON "public"."nft_define_quanties"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_nft_define_quanties_updatedAt" ON "public"."nft_define_quanties"
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO nft_define_quanties("refType","quality","totalSuply","totalMint") VALUES ('hero','epic',10000,0);

INSERT INTO nft_define_quanties("refType","quality","totalSuply","totalMint") VALUES ('hero','legend',1000,0);
