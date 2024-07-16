create table "public"."clubs" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "title" text,
    "description" text default ''''''::text,
    "when" text,
    "image" text,
    "expires" date,
    "deleteOnExpire" boolean,
    "author" bigint
);


create table "public"."drafts" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "post-type" text,
    "content" jsonb,
    "author" bigint not null,
    "title" text,
    "post_id" bigint
);


create table "public"."electives" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "title" text,
    "description" text,
    "duration" text,
    "cte" boolean,
    "image" text default '/images/electives/electivePlaceholder.webp'::text,
    "expires" date,
    "deleteOnExpire" boolean,
    "pathway" text,
    "author" bigint
);


create table "public"."events" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "title" text,
    "description" text,
    "date" date,
    "startTime" time without time zone,
    "endTime" time without time zone,
    "image" text,
    "link" bigint,
    "expires" date,
    "author" bigint
);


create table "public"."links" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "title" text,
    "url" text,
    "description" text,
    "expires" date,
    "deleteOnExpire" boolean,
    "category" text,
    "author" bigint
);


create table "public"."post_tags" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "post" bigint,
    "tag" bigint
);


create table "public"."posts" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "post-type" text,
    "content" jsonb,
    "author" bigint,
    "title" text,
    "searchableText" text,
    "schoolYear" text
);


create table "public"."staff" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text,
    "bio" text,
    "position" text,
    "image" text,
    "email" text,
    "phone" text,
    "expires" date,
    "deleteOnExpire" boolean,
    "department" text,
    "active" boolean default true
);


create table "public"."tags" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text,
    "description" text
);


create table "public"."testing_drafts" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "post-type" text,
    "content" jsonb,
    "author" bigint not null,
    "title" text,
    "post_id" bigint
);


create table "public"."testing_posts" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "post-type" text,
    "content" jsonb,
    "author" bigint,
    "title" text,
    "searchableText" text
);


create table "public"."users" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "first_name" text,
    "last_name" text,
    "position" text,
    "auth_id" uuid,
    "photo" text,
    "email" text,
    "staffId" bigint,
    "admin" boolean,
    "photo_cropped" text,
    "active" boolean
);


CREATE UNIQUE INDEX clubs_pkey ON public.clubs USING btree (id);

CREATE UNIQUE INDEX drafts_author_key ON public.testing_drafts USING btree (author);

CREATE UNIQUE INDEX drafts_author_key1 ON public.drafts USING btree (author);

CREATE UNIQUE INDEX drafts_pkey ON public.testing_drafts USING btree (id, author);

CREATE UNIQUE INDEX drafts_pkey1 ON public.drafts USING btree (id, author);

CREATE UNIQUE INDEX electives_pkey ON public.electives USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX links_pkey ON public.links USING btree (id);

CREATE UNIQUE INDEX post_tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX post_tags_pkey1 ON public.post_tags USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX staff_pkey ON public.staff USING btree (id);

CREATE UNIQUE INDEX testing_posts_pkey ON public.testing_posts USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."clubs" add constraint "clubs_pkey" PRIMARY KEY using index "clubs_pkey";

alter table "public"."drafts" add constraint "drafts_pkey1" PRIMARY KEY using index "drafts_pkey1";

alter table "public"."electives" add constraint "electives_pkey" PRIMARY KEY using index "electives_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."links" add constraint "links_pkey" PRIMARY KEY using index "links_pkey";

alter table "public"."post_tags" add constraint "post_tags_pkey1" PRIMARY KEY using index "post_tags_pkey1";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."staff" add constraint "staff_pkey" PRIMARY KEY using index "staff_pkey";

alter table "public"."tags" add constraint "post_tags_pkey" PRIMARY KEY using index "post_tags_pkey";

alter table "public"."testing_drafts" add constraint "drafts_pkey" PRIMARY KEY using index "drafts_pkey";

alter table "public"."testing_posts" add constraint "testing_posts_pkey" PRIMARY KEY using index "testing_posts_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."clubs" add constraint "clubs_author_fkey" FOREIGN KEY (author) REFERENCES users(id) not valid;

alter table "public"."clubs" validate constraint "clubs_author_fkey";

alter table "public"."drafts" add constraint "drafts_author_fkey1" FOREIGN KEY (author) REFERENCES users(id) not valid;

alter table "public"."drafts" validate constraint "drafts_author_fkey1";

alter table "public"."drafts" add constraint "drafts_author_key1" UNIQUE using index "drafts_author_key1";

alter table "public"."drafts" add constraint "drafts_post_id_fkey1" FOREIGN KEY (post_id) REFERENCES posts(id) not valid;

alter table "public"."drafts" validate constraint "drafts_post_id_fkey1";

alter table "public"."electives" add constraint "electives_author_fkey" FOREIGN KEY (author) REFERENCES users(id) not valid;

alter table "public"."electives" validate constraint "electives_author_fkey";

alter table "public"."events" add constraint "events_author_fkey" FOREIGN KEY (author) REFERENCES users(id) not valid;

alter table "public"."events" validate constraint "events_author_fkey";

alter table "public"."events" add constraint "events_link_fkey" FOREIGN KEY (link) REFERENCES links(id) not valid;

alter table "public"."events" validate constraint "events_link_fkey";

alter table "public"."links" add constraint "links_author_fkey" FOREIGN KEY (author) REFERENCES users(id) not valid;

alter table "public"."links" validate constraint "links_author_fkey";

alter table "public"."post_tags" add constraint "post_tags_post_fkey" FOREIGN KEY (post) REFERENCES posts(id) not valid;

alter table "public"."post_tags" validate constraint "post_tags_post_fkey";

alter table "public"."post_tags" add constraint "post_tags_tag_fkey" FOREIGN KEY (tag) REFERENCES tags(id) not valid;

alter table "public"."post_tags" validate constraint "post_tags_tag_fkey";

alter table "public"."posts" add constraint "posts_author_fkey" FOREIGN KEY (author) REFERENCES users(id) not valid;

alter table "public"."posts" validate constraint "posts_author_fkey";

alter table "public"."testing_drafts" add constraint "drafts_author_fkey" FOREIGN KEY (author) REFERENCES users(id) not valid;

alter table "public"."testing_drafts" validate constraint "drafts_author_fkey";

alter table "public"."testing_drafts" add constraint "drafts_author_key" UNIQUE using index "drafts_author_key";

alter table "public"."testing_drafts" add constraint "drafts_post_id_fkey" FOREIGN KEY (post_id) REFERENCES posts(id) not valid;

alter table "public"."testing_drafts" validate constraint "drafts_post_id_fkey";

alter table "public"."testing_posts" add constraint "testing_posts_author_fkey" FOREIGN KEY (author) REFERENCES users(id) not valid;

alter table "public"."testing_posts" validate constraint "testing_posts_author_fkey";

alter table "public"."users" add constraint "users_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."users" validate constraint "users_auth_id_fkey";

alter table "public"."users" add constraint "users_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES staff(id) not valid;

alter table "public"."users" validate constraint "users_staffId_fkey";

grant delete on table "public"."clubs" to "anon";

grant insert on table "public"."clubs" to "anon";

grant references on table "public"."clubs" to "anon";

grant select on table "public"."clubs" to "anon";

grant trigger on table "public"."clubs" to "anon";

grant truncate on table "public"."clubs" to "anon";

grant update on table "public"."clubs" to "anon";

grant delete on table "public"."clubs" to "authenticated";

grant insert on table "public"."clubs" to "authenticated";

grant references on table "public"."clubs" to "authenticated";

grant select on table "public"."clubs" to "authenticated";

grant trigger on table "public"."clubs" to "authenticated";

grant truncate on table "public"."clubs" to "authenticated";

grant update on table "public"."clubs" to "authenticated";

grant delete on table "public"."clubs" to "service_role";

grant insert on table "public"."clubs" to "service_role";

grant references on table "public"."clubs" to "service_role";

grant select on table "public"."clubs" to "service_role";

grant trigger on table "public"."clubs" to "service_role";

grant truncate on table "public"."clubs" to "service_role";

grant update on table "public"."clubs" to "service_role";

grant delete on table "public"."drafts" to "anon";

grant insert on table "public"."drafts" to "anon";

grant references on table "public"."drafts" to "anon";

grant select on table "public"."drafts" to "anon";

grant trigger on table "public"."drafts" to "anon";

grant truncate on table "public"."drafts" to "anon";

grant update on table "public"."drafts" to "anon";

grant delete on table "public"."drafts" to "authenticated";

grant insert on table "public"."drafts" to "authenticated";

grant references on table "public"."drafts" to "authenticated";

grant select on table "public"."drafts" to "authenticated";

grant trigger on table "public"."drafts" to "authenticated";

grant truncate on table "public"."drafts" to "authenticated";

grant update on table "public"."drafts" to "authenticated";

grant delete on table "public"."drafts" to "service_role";

grant insert on table "public"."drafts" to "service_role";

grant references on table "public"."drafts" to "service_role";

grant select on table "public"."drafts" to "service_role";

grant trigger on table "public"."drafts" to "service_role";

grant truncate on table "public"."drafts" to "service_role";

grant update on table "public"."drafts" to "service_role";

grant delete on table "public"."electives" to "anon";

grant insert on table "public"."electives" to "anon";

grant references on table "public"."electives" to "anon";

grant select on table "public"."electives" to "anon";

grant trigger on table "public"."electives" to "anon";

grant truncate on table "public"."electives" to "anon";

grant update on table "public"."electives" to "anon";

grant delete on table "public"."electives" to "authenticated";

grant insert on table "public"."electives" to "authenticated";

grant references on table "public"."electives" to "authenticated";

grant select on table "public"."electives" to "authenticated";

grant trigger on table "public"."electives" to "authenticated";

grant truncate on table "public"."electives" to "authenticated";

grant update on table "public"."electives" to "authenticated";

grant delete on table "public"."electives" to "service_role";

grant insert on table "public"."electives" to "service_role";

grant references on table "public"."electives" to "service_role";

grant select on table "public"."electives" to "service_role";

grant trigger on table "public"."electives" to "service_role";

grant truncate on table "public"."electives" to "service_role";

grant update on table "public"."electives" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."links" to "anon";

grant insert on table "public"."links" to "anon";

grant references on table "public"."links" to "anon";

grant select on table "public"."links" to "anon";

grant trigger on table "public"."links" to "anon";

grant truncate on table "public"."links" to "anon";

grant update on table "public"."links" to "anon";

grant delete on table "public"."links" to "authenticated";

grant insert on table "public"."links" to "authenticated";

grant references on table "public"."links" to "authenticated";

grant select on table "public"."links" to "authenticated";

grant trigger on table "public"."links" to "authenticated";

grant truncate on table "public"."links" to "authenticated";

grant update on table "public"."links" to "authenticated";

grant delete on table "public"."links" to "service_role";

grant insert on table "public"."links" to "service_role";

grant references on table "public"."links" to "service_role";

grant select on table "public"."links" to "service_role";

grant trigger on table "public"."links" to "service_role";

grant truncate on table "public"."links" to "service_role";

grant update on table "public"."links" to "service_role";

grant delete on table "public"."post_tags" to "anon";

grant insert on table "public"."post_tags" to "anon";

grant references on table "public"."post_tags" to "anon";

grant select on table "public"."post_tags" to "anon";

grant trigger on table "public"."post_tags" to "anon";

grant truncate on table "public"."post_tags" to "anon";

grant update on table "public"."post_tags" to "anon";

grant delete on table "public"."post_tags" to "authenticated";

grant insert on table "public"."post_tags" to "authenticated";

grant references on table "public"."post_tags" to "authenticated";

grant select on table "public"."post_tags" to "authenticated";

grant trigger on table "public"."post_tags" to "authenticated";

grant truncate on table "public"."post_tags" to "authenticated";

grant update on table "public"."post_tags" to "authenticated";

grant delete on table "public"."post_tags" to "service_role";

grant insert on table "public"."post_tags" to "service_role";

grant references on table "public"."post_tags" to "service_role";

grant select on table "public"."post_tags" to "service_role";

grant trigger on table "public"."post_tags" to "service_role";

grant truncate on table "public"."post_tags" to "service_role";

grant update on table "public"."post_tags" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."staff" to "anon";

grant insert on table "public"."staff" to "anon";

grant references on table "public"."staff" to "anon";

grant select on table "public"."staff" to "anon";

grant trigger on table "public"."staff" to "anon";

grant truncate on table "public"."staff" to "anon";

grant update on table "public"."staff" to "anon";

grant delete on table "public"."staff" to "authenticated";

grant insert on table "public"."staff" to "authenticated";

grant references on table "public"."staff" to "authenticated";

grant select on table "public"."staff" to "authenticated";

grant trigger on table "public"."staff" to "authenticated";

grant truncate on table "public"."staff" to "authenticated";

grant update on table "public"."staff" to "authenticated";

grant delete on table "public"."staff" to "service_role";

grant insert on table "public"."staff" to "service_role";

grant references on table "public"."staff" to "service_role";

grant select on table "public"."staff" to "service_role";

grant trigger on table "public"."staff" to "service_role";

grant truncate on table "public"."staff" to "service_role";

grant update on table "public"."staff" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";

grant delete on table "public"."testing_drafts" to "anon";

grant insert on table "public"."testing_drafts" to "anon";

grant references on table "public"."testing_drafts" to "anon";

grant select on table "public"."testing_drafts" to "anon";

grant trigger on table "public"."testing_drafts" to "anon";

grant truncate on table "public"."testing_drafts" to "anon";

grant update on table "public"."testing_drafts" to "anon";

grant delete on table "public"."testing_drafts" to "authenticated";

grant insert on table "public"."testing_drafts" to "authenticated";

grant references on table "public"."testing_drafts" to "authenticated";

grant select on table "public"."testing_drafts" to "authenticated";

grant trigger on table "public"."testing_drafts" to "authenticated";

grant truncate on table "public"."testing_drafts" to "authenticated";

grant update on table "public"."testing_drafts" to "authenticated";

grant delete on table "public"."testing_drafts" to "service_role";

grant insert on table "public"."testing_drafts" to "service_role";

grant references on table "public"."testing_drafts" to "service_role";

grant select on table "public"."testing_drafts" to "service_role";

grant trigger on table "public"."testing_drafts" to "service_role";

grant truncate on table "public"."testing_drafts" to "service_role";

grant update on table "public"."testing_drafts" to "service_role";

grant delete on table "public"."testing_posts" to "anon";

grant insert on table "public"."testing_posts" to "anon";

grant references on table "public"."testing_posts" to "anon";

grant select on table "public"."testing_posts" to "anon";

grant trigger on table "public"."testing_posts" to "anon";

grant truncate on table "public"."testing_posts" to "anon";

grant update on table "public"."testing_posts" to "anon";

grant delete on table "public"."testing_posts" to "authenticated";

grant insert on table "public"."testing_posts" to "authenticated";

grant references on table "public"."testing_posts" to "authenticated";

grant select on table "public"."testing_posts" to "authenticated";

grant trigger on table "public"."testing_posts" to "authenticated";

grant truncate on table "public"."testing_posts" to "authenticated";

grant update on table "public"."testing_posts" to "authenticated";

grant delete on table "public"."testing_posts" to "service_role";

grant insert on table "public"."testing_posts" to "service_role";

grant references on table "public"."testing_posts" to "service_role";

grant select on table "public"."testing_posts" to "service_role";

grant trigger on table "public"."testing_posts" to "service_role";

grant truncate on table "public"."testing_posts" to "service_role";

grant update on table "public"."testing_posts" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


