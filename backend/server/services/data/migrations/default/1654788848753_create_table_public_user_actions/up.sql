
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
