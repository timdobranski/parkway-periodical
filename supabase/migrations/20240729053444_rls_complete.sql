alter table "public"."clubs" enable row level security;

alter table "public"."drafts" enable row level security;

alter table "public"."electives" enable row level security;

alter table "public"."events" enable row level security;

alter table "public"."links" enable row level security;

alter table "public"."post_tags" enable row level security;

alter table "public"."staff" enable row level security;

alter table "public"."tags" enable row level security;

alter table "public"."users" enable row level security;

create policy "Enable delete for authenticated users only"
on "public"."clubs"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."clubs"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."clubs"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."clubs"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."drafts"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."drafts"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."drafts"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."drafts"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."electives"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."electives"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."electives"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."electives"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."events"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."events"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."events"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."events"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."links"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."links"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."links"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."links"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."post_tags"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."post_tags"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."post_tags"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."post_tags"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."staff"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."staff"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."staff"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."staff"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."tags"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."tags"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."tags"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."tags"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."users"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."users"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to public
using (true);


create policy "Enable update for authenticated users only"
on "public"."users"
as permissive
for update
to authenticated
using (true);



