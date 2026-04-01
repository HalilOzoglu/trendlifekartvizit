-- Profiles tablosu (auth.users ile bağlantılı)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz default now()
);

-- Cards tablosu
create table public.cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  username text unique not null,
  full_name text not null,
  title text,
  company text,
  avatar_url text,
  cover_url text,
  bio text,
  phone text,
  email text,
  website text,
  invoice_company text,
  invoice_address text,
  invoice_tax_office text,
  invoice_tax_no text,
  bank_name text,
  bank_account_holder text,
  bank_iban text,
  video_url text,
  theme_color text default '#1a1a2e',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Social links tablosu
create table public.social_links (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references public.cards(id) on delete cascade not null,
  platform text not null,
  url text not null,
  order_index integer default 0
);

-- RLS politikaları
alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.social_links enable row level security;

-- Recursive RLS sorununu önlemek için security definer function
create or replace function public.get_my_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- Profiles politikaları
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Admin can manage all profiles" on public.profiles
  for all using (public.get_my_role() = 'admin');

-- Cards politikaları
create policy "Public can view active cards" on public.cards
  for select using (is_active = true);

create policy "Users can manage own cards" on public.cards
  for all using (auth.uid() = user_id);

create policy "Admin can manage all cards" on public.cards
  for all using (public.get_my_role() = 'admin');

-- Social links politikaları
create policy "Public can view social links" on public.social_links
  for select using (
    exists (select 1 from public.cards where id = card_id and is_active = true)
  );

create policy "Users can manage own social links" on public.social_links
  for all using (
    exists (select 1 from public.cards where id = card_id and user_id = auth.uid())
  );

create policy "Admin can manage all social links" on public.social_links
  for all using (public.get_my_role() = 'admin');

-- Yeni kullanıcı kaydında otomatik profil oluştur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
