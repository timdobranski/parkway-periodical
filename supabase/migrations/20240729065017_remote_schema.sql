set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

create policy "Allow anyone to view user photos"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'users'::text));


create policy "Allow authenticated users to delete 1zu98_0"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'misc'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Allow authenticated users to delete their profile photos"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'users'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Allow authenticated users to insert 1zu98_0"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'misc'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Allow authenticated users to update 1zu98_0"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'misc'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Allow authenticated users to update photos"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'users'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Allow authenticated users to upload profile photos"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'users'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Enable read access for all users"
on "storage"."objects"
as permissive
for select
to public
using (true);


create policy "Give access to a file to user dlam4g_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'contentTypes'::text));


create policy "Give users access to read files 1zu98_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'misc'::text));


create policy "Give users authenticated access to folder 1rma4z_0"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'posts'::text) AND ((storage.foldername(name))[1] = 'photos'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1rma4z_1"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'posts'::text) AND ((storage.foldername(name))[1] = 'photos'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1rma4z_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'posts'::text) AND ((storage.foldername(name))[1] = 'photos'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder dlam4g_0"
on "storage"."objects"
as permissive
for insert
to public
with check (((bucket_id = 'contentTypes'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder dlam4g_1"
on "storage"."objects"
as permissive
for update
to public
using (((bucket_id = 'contentTypes'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder dlam4g_2"
on "storage"."objects"
as permissive
for delete
to public
using (((bucket_id = 'contentTypes'::text) AND (auth.role() = 'authenticated'::text)));


create policy "full read access 1rma4z_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'posts'::text));



