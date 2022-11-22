alter table "public"."game_plays" add column "heroSpawneds" jsonb
 null default jsonb_build_array();
