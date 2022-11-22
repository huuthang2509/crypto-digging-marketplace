
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
