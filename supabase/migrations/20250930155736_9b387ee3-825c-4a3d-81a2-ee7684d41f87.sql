-- Table des documents liés à un chien
create table if not exists public.dog_documents (
  id uuid primary key default gen_random_uuid(),
  dog_id uuid not null references public.dogs(id) on delete cascade,
  owner_id uuid not null references public.owners(user_id) on delete cascade,
  title text,
  file_name text not null,
  file_type text not null,
  file_size bigint,
  storage_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_dog_documents_dog_id on public.dog_documents(dog_id);
create index if not exists idx_dog_documents_owner_id on public.dog_documents(owner_id);

alter table public.dog_documents enable row level security;

-- OWNERS : accès complet à leurs documents via leurs chiens
create policy "owner can manage own dog documents"
on public.dog_documents
for all
using (
  owner_id = auth.uid()
)
with check (
  owner_id = auth.uid()
);

-- PROS : lecture des documents des chiens partagés (accepted, non expirés)
create policy "pro can read docs for shared dogs"
on public.dog_documents
for select
using (
  exists (
    select 1
    from public.dog_shares s
    join public.professionals p on p.user_id = s.professional_id
    where s.dog_id = dog_documents.dog_id
      and p.user_id = auth.uid()
      and s.status = 'accepted'
      and (s.expires_at is null or s.expires_at > now())
  )
);

-- Création du bucket privé pour les documents
insert into storage.buckets (id, name, public, file_size_limit)
values ('dog-documents', 'dog-documents', false, 10485760)
on conflict (id) do nothing;

-- POLICY: Owner peut uploader/manager ses fichiers sous le préfixe owner_id/
create policy "owner can upload to own prefix"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'dog-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "owner can update/delete own objects"
on storage.objects for update
to authenticated
using (
  bucket_id = 'dog-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'dog-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "owner can delete own objects"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'dog-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "owner can select own objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'dog-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- POLICY: Pro peut lire les objets des chiens partagés
create policy "pro can select shared dog objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'dog-documents'
  and exists (
    select 1
    from public.dog_documents dd
    join public.dog_shares s on s.dog_id = dd.dog_id
    join public.professionals p on p.user_id = s.professional_id
    where dd.storage_path = storage.objects.name
      and p.user_id = auth.uid()
      and s.status = 'accepted'
      and (s.expires_at is null or s.expires_at > now())
  )
);