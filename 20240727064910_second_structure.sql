alter table "public"."post_tags" drop constraint "post_tags_post_fkey";

alter table "public"."events" alter column "endTime" set data type text using "endTime"::text;

alter table "public"."events" alter column "startTime" set data type text using "startTime"::text;

alter table "public"."posts" enable row level security;

alter table "public"."post_tags" add constraint "post_tags_post_fkey" FOREIGN KEY (post) REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."post_tags" validate constraint "post_tags_post_fkey";

create policy "Enable delete for authenticated users only"
on "public"."posts"
as permissive
for delete
to public
using ((auth.role() = 'authenticated'::text));


create policy "Enable insert for authenticated users only"
on "public"."posts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."posts"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."posts"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text));



