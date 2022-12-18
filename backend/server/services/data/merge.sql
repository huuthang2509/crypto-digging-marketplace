CREATE TABLE "public"."test" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;


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


alter table "public"."users" alter column "id" set default gen_random_uuid();



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


INSERT INTO "boxes_types"("name","CDGPrice","img","commonRatio","rareRatio","epicRatio","legendRatio","boxType") VALUES ('Common Box',10,'/server/resource/box_common.png',80,16,3,1,'common');
INSERT INTO "boxes_types"("name","CDGPrice","img","commonRatio","rareRatio","epicRatio","legendRatio","boxType") VALUES ('Rare Box',50,'/server/resource/box_rare.png',50,40,8,2,'rare');
INSERT INTO "boxes_types"("name","CDGPrice","img","commonRatio","rareRatio","epicRatio","legendRatio","boxType") VALUES ('Epic Box',100,'/server/resource/box_epic.png',30,45,20,5,'epic');
INSERT INTO "boxes_types"("name","CDGPrice","img","commonRatio","rareRatio","epicRatio","legendRatio","boxType") VALUES ('Legend Box',500,'/server/resource/box_legend.png',80,14,5,1,'legend');



alter table "public"."boxes" drop column "CDGPriceCapture" cascade;

alter table "public"."boxes" add column "tokenId" text
 null;

alter table "public"."boxes" add column "ownerId" uuid
 null;

alter table "public"."boxes" add column "boxInfoCapture" jsonb
 null default jsonb_build_object();

alter table "public"."boxes"
  add constraint "boxes_ownerId_fkey"
  foreign key ("ownerId")
  references "public"."users"
  ("id") on update restrict on delete restrict;

alter table "public"."boxes" drop column "userId" cascade;



CREATE TABLE "public"."user_actions" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;

alter table "public"."user_actions" add column "nonce" text
 not null;

alter table "public"."user_actions" add column "signature" Text
 not null;

alter table "public"."user_actions" add column "walletAddress" Text
 not null;

alter table "public"."user_actions" add column "createdAt" timestamptz
 null default now();

alter table "public"."user_actions" add column "updatedAt" timestamptz
 null default now();

alter table "public"."user_actions" add column "expiredAt" Timestamp
 not null;

alter table "public"."user_actions" add column "action" text
 not null default 'purchase';

alter table "public"."user_actions" add column "status" text
 null default 'active';



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


alter table "public"."user_actions" alter column "action" set default 'transfer_owner'::text;


alter table "public"."heros_bases" add column "skins" jsonb
 null default jsonb_build_array();

UPDATE "heros_bases" SET skins='[{"name":"Meiko","image":"/assets/heros/common/Noel2.png","imageAssetName":"Noel2.png","description":"Member of the Delta Special Ops, Raidons responsibility is secure the peace of the people. He believes that Justices above all that why he is the hero of Earths people."},{"name":"Veinka","image":"/assets/heros/common/image (10).png","imageAssetName":"image (10).png","description":"Code Name: Serpant. He is the Commander of South America Marine Force. His special ability is flanking and ambushing the enemy."},{"name":"Steel Shot","image":"/assets/heros/common/image (11).png","imageAssetName":"image (11).png","description":"Recruited from the Royal Britian Security Force, by the order of the queen, Veinka is mechanically elevated and joins the United Nation to protect the homeland."},{"name":"Errant Ghost","image":"/assets/heros/common/image (12).png","imageAssetName":"image (12).png","description":"Member of Sniper Force, Morrod is the silence killer who is the master of scouting and eliminate the target in really long distance."},{"name":"Culien","image":"/assets/heros/common/image (8).png","imageAssetName":"image (8).png","description":"One who is known as legendary bounty hunter. Cluster is a high-skilled ranger with many combat tricks. His biggest rival is BigPapa with the most highest wanted reward. During the capturing, Cluster caused many cruels but they are all covered by the government."}]' WHERE type='common';

UPDATE "heros_bases" SET skins='[{"name":"Breaker","image":"/assets/heros/rare/image (13).png","imageAssetName":"image (13).png","description":"The Senior Commander of Delta Force, Steelshot, is a master in sweeping campaigns and conquering enemy strongholds by his extremly strategic capabilites and advanced technolgy and firepower."},{"name":"Raidon","image":"/assets/heros/rare/image (14).png","imageAssetName":"image (14).png","description":"Errant Ghost is the leader of the Order. He used to be a senior member of the Government; however, he has been expelled from the army because of his power manipulation behavior."},{"name":"Destroid","image":"/assets/heros/rare/image (15).png","imageAssetName":"image (15).png","description":"Joining the Saviors for protecting the people of his homeland against the dictatorial invasion of the Governement. Rei gradually get caught up in the eternal confilcts between factions."},{"name":"Ramer","image":"/assets/heros/rare/image (16).png","imageAssetName":"image (16).png","description":"Wanted by the Government around the world for committing destructive explosives, Destroid, who known as Explosive Expert, is acquired by Errant Ghost to join the Saviors. His biggest rival is Raidon of the Government."},{"name":"Satushield","image":"/assets/heros/rare/image (17).png","imageAssetName":"image (17).png","description":"The younger brother of the twin criminals in the Metal Outlaws gand, Mortal is smarter than Breaker a bit but still loves fighting and destroying things. He looks like a dwarf."}]' WHERE type='rare';

UPDATE "heros_bases" SET skins='[{"name":"Kanto","image":"/assets/heros/epic/image (1).png","imageAssetName":"image (1).png","description":"A gangster who loves rock music. Haunted by the thinking that the world is too peaceful which isnt look like her music. She creates herself a electric guitar that emits sonic waves which can destroy anything she doesnt like."},{"name":"Shiba","image":"/assets/heros/epic/image (2).png","imageAssetName":"image (2).png","description":"Unable to suffer the pain of innocent people from the eternal conflicts between Government groups, Phoenix decided to join the Nova. With her own abilities, Phoenix rapidly becomes a core member in the Nova."},{"name":"Annate","image":"/assets/heros/epic/image (3).png","imageAssetName":"image (3).png","description":"A mechanical augmented girl who loves to create powerful mecharobots. Having witnessed many cruel and unfair things in the world, Meiko decided to become a savior by herself. Using her own mecharobot to help the weak, Meiko quickly becomes a trustful hero. Together with Phoenix and Shanna, she is requested to be a protector of the Nova legacy."},{"name":"Hachima","image":"/assets/heros/epic/image.png","imageAssetName":"image.png","description":"A godfather from the South America, BigPapa represents for the supreme power of the underworld. Dont even dare to mess up with him."}]' WHERE type='epic';

UPDATE "heros_bases" SET skins='[{"name":"Monomi","image":"/assets/heros/legend/image (4).png","imageAssetName":"image (4).png","description":"Came from the lost tribe which was famous for technology, Durass is a kind warrior who has a bright heart. However, BigPapa wants him to join the force then he trapped Durass and made Durass becomes one of BigPapas strongest subordinates."},{"name":"Santabra","image":"/assets/heros/legend/image (5).png","imageAssetName":"image (5).png","description":"Lost his family in a war between Government army and the Rebels, Bathos was injured and saved by the Solar Eclipse. After being rescued by faction, he swears to live a life as an avenger."},{"name":"Rosima","image":"/assets/heros/legend/image (6).png","imageAssetName":"image (6).png","description":"A Taekwondo master who has big ambition to reach to top of the martial arts, Taekwon finds and engages all others who called themselves martial arts master to find his right path. He respects the rules and justice and always be the one who can take all the responsibility on his hand."},{"name":"Takeoshi","image":"/assets/heros/legend/image (7).png","imageAssetName":"image (7).png","description":"Born from the forgotten Noble family, Mary has a skill set of assasinate and be a master in using daggers and pistols. She is definitely a danger for any target. With her agility, she can eliminate the target and escape rapidly without being noticed."}]' WHERE type='legend';

alter table "public"."heros" add column "description" text
 null;

alter table "public"."heros_bases" rename column "skins" to "data";



alter table "public"."marketplace" add column "status" text
 null default 'active';

CREATE EXTENSION IF NOT EXISTS pgcrypto;
alter table "public"."marketplace" add column "id" uuid
 null default gen_random_uuid();

BEGIN TRANSACTION;
ALTER TABLE "public"."marketplace" DROP CONSTRAINT "marketplace_pkey";

ALTER TABLE "public"."marketplace"
    ADD CONSTRAINT "marketplace_pkey" PRIMARY KEY ("id");
COMMIT TRANSACTION;

alter table "public"."marketplace" drop column "heroId" cascade;

alter table "public"."marketplace" add column "refId" uuid
 null;

alter table "public"."marketplace" add column "refType" text
 null;

alter table "public"."marketplace" drop column "itemType" cascade;

alter table "public"."boxes" add column "readyToUse" boolean
 null default 'true';


alter table "public"."marketplace" add column "itemCapture" jsonb
 null default jsonb_build_object();



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


alter table "public"."heros" alter column "tokenId" drop not null;


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


alter table "public"."nft_define_quanties" rename column "totalSuply" to "totalSupply";


CREATE TABLE "public"."user_logs" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "status" text NOT NULL DEFAULT 'active', "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), "createdBy" uuid, "updatedBy" UUID, "userId" uuid NOT NULL, "logType" text NOT NULL, "action" text NOT NULL, "data" jsonb NOT NULL DEFAULT jsonb_build_object(), PRIMARY KEY ("id") , FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict);
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
CREATE TRIGGER "set_public_user_logs_updatedAt"
BEFORE UPDATE ON "public"."user_logs"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updatedAt"();
COMMENT ON TRIGGER "set_public_user_logs_updatedAt" ON "public"."user_logs" 
IS 'trigger to set value of column "updatedAt" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;



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


ALTER TABLE "public"."heros" ALTER COLUMN "currentStamina" TYPE float8;


alter table "public"."game_plays" add column "heroSpawneds" jsonb
 null default jsonb_build_array();
