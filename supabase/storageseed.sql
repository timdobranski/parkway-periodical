SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('posts', 'posts', NULL, '2024-01-20 19:46:40.400854+00', '2024-01-20 19:46:40.400854+00', true, false, NULL, NULL, NULL),
	('users', 'users', NULL, '2024-04-03 02:31:10.982165+00', '2024-04-03 02:31:10.982165+00', true, false, NULL, NULL, NULL),
	('misc', 'misc', NULL, '2024-06-05 21:13:13.84304+00', '2024-06-05 21:13:13.84304+00', true, false, NULL, NULL, NULL),
	('contentTypes', 'contentTypes', NULL, '2024-07-08 19:26:30.879961+00', '2024-07-08 19:26:30.879961+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id") VALUES
	('d4992b03-ced0-4173-b683-59b44e638798', 'posts', 'photos/.emptyFolderPlaceholder', NULL, '2024-01-20 19:46:52.553522+00', '2024-01-20 19:46:52.553522+00', '2024-01-20 19:46:52.553522+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-01-20T19:46:53.000Z", "contentLength": 0, "httpStatusCode": 200}', '342fdcd5-c43a-495c-adf6-0cea38c0c9f7', NULL),
	('df6c1f68-4557-4f4b-9208-3b7ee2695010', 'contentTypes', 'clubs/.emptyFolderPlaceholder', NULL, '2024-07-08 19:26:44.115827+00', '2024-07-08 19:26:44.115827+00', '2024-07-08 19:26:44.115827+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-07-08T19:26:45.000Z", "contentLength": 0, "httpStatusCode": 200}', '4cdc97b6-3932-4122-8674-2b7d20ee0897', NULL),
	('b96e2630-8a7b-43be-a47a-f56b2c102134', 'contentTypes', 'events/.emptyFolderPlaceholder', NULL, '2024-07-08 19:26:50.492298+00', '2024-07-08 19:26:50.492298+00', '2024-07-08 19:26:50.492298+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-07-08T19:26:51.000Z", "contentLength": 0, "httpStatusCode": 200}', 'b05fd0fa-30d7-4383-bb47-dff4873e6845', NULL),
	('458b7ea7-aa97-4a21-8172-ddd745f44de6', 'contentTypes', 'links/.emptyFolderPlaceholder', NULL, '2024-07-08 19:27:00.989473+00', '2024-07-08 19:27:00.989473+00', '2024-07-08 19:27:00.989473+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-07-08T19:27:01.000Z", "contentLength": 0, "httpStatusCode": 200}', '4a78a9b3-b6bc-470e-a036-4a15aeff02d7', NULL),
	('2a968ca5-dcd8-4c9a-867b-6832b6a8dd93', 'contentTypes', 'electives/.emptyFolderPlaceholder', NULL, '2024-07-09 19:31:30.455037+00', '2024-07-09 19:31:30.455037+00', '2024-07-09 19:31:30.455037+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-07-09T19:31:31.000Z", "contentLength": 0, "httpStatusCode": 200}', '5a66e15d-b09f-4b96-a0f8-18b3a26e382b', NULL),
	('2b7d3602-9d09-453c-a87d-4a2e01f42d02', 'users', 'photos/timdobranski@gmail.com/cropped', '69d16a9f-76fc-4bff-baf8-4ac21c0f5a4b', '2024-07-04 21:10:47.778227+00', '2024-07-21 04:43:44.671238+00', '2024-07-04 21:10:47.778227+00', '{"eTag": "\"e99c1dcaf6997d2534f479f3d740f8a7\"", "size": 33006, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-07-21T04:43:45.000Z", "contentLength": 33006, "httpStatusCode": 200}', '64e2385f-bee0-483f-91c5-ddb582cda418', '69d16a9f-76fc-4bff-baf8-4ac21c0f5a4b'),
	('543fd900-41f6-4f38-9ebc-a126900f7936', 'misc', 'parkway.webp', NULL, '2024-06-05 21:13:51.992732+00', '2024-06-05 21:13:51.992732+00', '2024-06-05 21:13:51.992732+00', '{"eTag": "\"b95c1b871606b3e7cf9196fac1dc16ca\"", "size": 16858, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-06-05T21:13:52.000Z", "contentLength": 16858, "httpStatusCode": 200}', 'd640fb4d-cf10-449a-95ff-6fb6fbb6b264', NULL),
	('c41c7219-54c1-4a32-89fd-2dca30212d45', 'users', 'photos/timdobranski@gmail.com/original', '69d16a9f-76fc-4bff-baf8-4ac21c0f5a4b', '2024-07-02 01:51:28.845923+00', '2024-07-21 04:43:11.825903+00', '2024-07-02 01:51:28.845923+00', '{"eTag": "\"8808b3afec7cc7bd1c58d8372189bda7\"", "size": 152970, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-07-21T04:43:12.000Z", "contentLength": 152970, "httpStatusCode": 200}', '9726f974-abd4-418a-bfa5-8dee743bdf5e', '69d16a9f-76fc-4bff-baf8-4ac21c0f5a4b'),
	('0af7104d-f2fb-465e-9684-7ffc21211018', 'users', 'photos/tim@lamesastringschool.com/original', '98c52707-794f-4b15-8fdb-3cea1f4fbc1a', '2024-07-05 21:46:46.612461+00', '2024-07-05 22:37:20.322661+00', '2024-07-05 21:46:46.612461+00', '{"eTag": "\"8808b3afec7cc7bd1c58d8372189bda7\"", "size": 152970, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-07-05T22:37:21.000Z", "contentLength": 152970, "httpStatusCode": 200}', 'dab996f4-9aa0-4539-bd5f-9dc4a8d69ea3', '98c52707-794f-4b15-8fdb-3cea1f4fbc1a'),
	('07be1426-13d1-48de-a7a2-995887494c0b', 'users', 'photos/tim@lamesastringschool.com/cropped', '98c52707-794f-4b15-8fdb-3cea1f4fbc1a', '2024-07-05 21:47:03.745006+00', '2024-07-05 22:37:50.386817+00', '2024-07-05 21:47:03.745006+00', '{"eTag": "\"6e2e44283ed3b0be5d9fe17447bafa81\"", "size": 33670, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-07-05T22:37:51.000Z", "contentLength": 33670, "httpStatusCode": 200}', '7a51a9a1-4df4-420c-9906-909958a89e5f', '98c52707-794f-4b15-8fdb-3cea1f4fbc1a'),
	('d8e6bfef-dbef-483d-acfd-b9e6bc0be816', 'misc', 'parkwayWhiteBackground.webp', NULL, '2024-06-13 19:22:59.075163+00', '2024-06-13 19:22:59.075163+00', '2024-06-13 19:22:59.075163+00', '{"eTag": "\"fefcfbe56667e73e222978410ce53a16\"", "size": 14434, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2024-06-13T19:23:00.000Z", "contentLength": 14434, "httpStatusCode": 200}', 'bfac8e08-78a6-42c7-8b10-cdee5bb0bec4', NULL);


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- PostgreSQL database dump complete
--

RESET ALL;
