alter table "public"."marketplace" add column "itemCapture" jsonb
 null default jsonb_build_object();
