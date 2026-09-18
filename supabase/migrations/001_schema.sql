-- ============================================================
-- THE GYMIST — Complete Database Schema
-- Run this migration against your Supabase project
-- ============================================================

-- ===== SETTINGS & CONTENT =====
create table if not exists site_settings (
  id int primary key default 1,
  gym_name text not null default 'The Gymist',
  tagline text default 'Train with intent.',
  phone text not null default '+254740396075',
  whatsapp_number text not null default '254740396075',
  whatsapp_default_message text default 'Hi The Gymist, I''d like to know more about your gym.',
  email text default 'hello@thegymist.co.ke',
  address text default 'Wood Avenue, off Lenana Road, Kilimani, Nairobi',
  map_embed_url text default 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8176!2d36.7850!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0NycwNi4wIkU!5e0!3m2!1sen!2ske!4v1',
  instagram_url text default 'https://instagram.com/thegymist',
  tiktok_url text default 'https://tiktok.com/@thegymist',
  facebook_url text,
  x_url text default 'https://x.com/thegymist',
  mpesa_paybill text default '247247',
  mpesa_account text default 'GYMIST',
  logo_url text,
  og_image_url text,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

create table if not exists opening_hours (
  id uuid primary key default gen_random_uuid(),
  day_of_week int not null check (day_of_week between 0 and 6),
  opens time,
  closes time,
  is_closed boolean default false,
  sort_order int
);

create table if not exists page_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  section_key text not null,
  heading text,
  subheading text,
  body text,
  image_url text,
  cta_label text,
  cta_href text,
  is_visible boolean default true,
  sort_order int default 0,
  unique (page_slug, section_key)
);

create table if not exists stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value numeric not null,
  suffix text,
  sort_order int,
  is_visible boolean default true
);

-- ===== WORKOUTS =====
create table if not exists workouts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('Strength','Conditioning','Hypertrophy','Mobility','Core','Olympic')),
  tier int not null check (tier between 1 and 3),
  short_description text not null,
  image_url text not null,
  image_alt text not null,
  image_prompt text,
  primary_muscles text[] not null,
  secondary_muscles text[],
  equipment text[] not null,
  steps jsonb not null,
  cues jsonb not null,
  mistakes jsonb not null,
  progressions jsonb,
  regressions jsonb,
  sets_reps text,
  rest_seconds int,
  tempo text,
  programming_notes text,
  is_featured boolean default false,
  is_published boolean default true,
  sort_order int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===== INSTRUCTORS =====
create table if not exists instructors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  full_name text not null,
  role text not null,
  philosophy text,
  bio text not null,
  portrait_url text not null,
  portrait_alt text,
  gallery_urls text[],
  specialities text[],
  categories text[],
  certifications jsonb,
  years_coaching int,
  sessions_delivered int,
  members_coached int,
  availability jsonb,
  instagram_url text,
  whatsapp_number text,
  is_published boolean default true,
  sort_order int default 0
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_image_url text,
  quote text not null,
  rating int check (rating between 1 and 5),
  instructor_id uuid references instructors(id) on delete set null,
  is_featured boolean default false,
  is_published boolean default true
);

-- ===== CLASSES & TIMETABLE =====
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  image_url text,
  intensity int check (intensity between 1 and 5),
  duration_minutes int not null default 60,
  capacity int not null default 14,
  what_to_bring text,
  who_its_for text,
  instructor_id uuid references instructors(id) on delete set null,
  color_hex text default '#D7FF3E',
  is_published boolean default true
);

create table if not exists class_sessions (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  instructor_id uuid references instructors(id) on delete set null,
  capacity_override int,
  is_active boolean default true
);

create table if not exists blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_on date not null unique,
  reason text
);

-- ===== MEMBERSHIP =====
create table if not exists membership_plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price_kes int not null,
  annual_price_kes int,
  period text default 'month',
  description text,
  features jsonb not null,
  is_highlighted boolean default false,
  is_published boolean default true,
  sort_order int default 0
);

-- ===== BOOKINGS =====
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  booking_type text not null check (booking_type in ('intro','class','personal_training','day_pass')),
  class_id uuid references classes(id) on delete set null,
  class_session_id uuid references class_sessions(id) on delete set null,
  instructor_id uuid references instructors(id) on delete set null,
  booking_date date not null,
  booking_time time not null,
  full_name text not null,
  phone text not null,
  email text not null,
  goal text,
  injuries text,
  heard_from text,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed','no_show')),
  amount_kes int default 0,
  payment_status text default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
  payment_ref text,
  idempotency_key text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_bookings_date_time on bookings (booking_date, booking_time);
create index if not exists idx_bookings_status on bookings (status);
create index if not exists idx_bookings_reference on bookings (reference);

-- ===== BLOG =====
create table if not exists blog_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text not null,
  body_md text not null,
  cover_image_url text not null,
  cover_image_alt text,
  category_id uuid references blog_categories(id) on delete set null,
  author_id uuid references instructors(id) on delete set null,
  tags text[],
  reading_minutes int,
  meta_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean default false,
  published_at timestamptz,
  view_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_blog_posts_status on blog_posts (status, published_at desc);

-- ===== NUTRITION =====
create table if not exists foods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  local_name text,
  category text,
  serving_description text,
  serving_grams numeric,
  kcal_per_100g numeric not null,
  protein_g numeric not null,
  carbs_g numeric not null,
  fat_g numeric not null,
  fiber_g numeric,
  is_published boolean default true
);

create table if not exists nutrition_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  full_name text,
  inputs jsonb,
  results jsonb,
  created_at timestamptz default now()
);

-- ===== ENQUIRIES, FAQ, GALLERY, NEWSLETTER =====
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text,
  email text not null,
  subject text,
  message text not null,
  status text default 'new' check (status in ('new','read','replied','archived')),
  created_at timestamptz default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  sort_order int,
  is_published boolean default true
);

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt_text text not null,
  caption text,
  category text,
  sort_order int,
  is_published boolean default true
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  created_at timestamptz default now()
);

-- ===== ADMIN =====
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'staff' check (role in ('admin','editor','staff')),
  created_at timestamptz default now()
);

create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text,
  entity_id text,
  meta jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Helper: is the current user an admin or editor?
create or replace function is_admin_or_editor()
returns boolean as $$
  select exists (
    select 1 from profiles p
    where p.id = auth.uid()
    and p.role in ('admin', 'editor')
  );
$$ language sql security definer stable;

-- Helper: is the current user any staff role?
create or replace function is_staff()
returns boolean as $$
  select exists (
    select 1 from profiles p
    where p.id = auth.uid()
    and p.role in ('admin', 'editor', 'staff')
  );
$$ language sql security definer stable;

-- site_settings
alter table site_settings enable row level security;
create policy "public read site_settings" on site_settings for select using (true);
create policy "admins manage site_settings" on site_settings for all using (is_admin_or_editor());

-- opening_hours
alter table opening_hours enable row level security;
create policy "public read opening_hours" on opening_hours for select using (true);
create policy "admins manage opening_hours" on opening_hours for all using (is_admin_or_editor());

-- page_sections
alter table page_sections enable row level security;
create policy "public read visible page_sections" on page_sections for select using (is_visible = true);
create policy "admins manage page_sections" on page_sections for all using (is_admin_or_editor());

-- stats
alter table stats enable row level security;
create policy "public read visible stats" on stats for select using (is_visible = true);
create policy "admins manage stats" on stats for all using (is_admin_or_editor());

-- workouts
alter table workouts enable row level security;
create policy "public read published workouts" on workouts for select using (is_published = true);
create policy "admins manage workouts" on workouts for all using (is_admin_or_editor());

-- instructors
alter table instructors enable row level security;
create policy "public read published instructors" on instructors for select using (is_published = true);
create policy "admins manage instructors" on instructors for all using (is_admin_or_editor());

-- testimonials
alter table testimonials enable row level security;
create policy "public read published testimonials" on testimonials for select using (is_published = true);
create policy "admins manage testimonials" on testimonials for all using (is_admin_or_editor());

-- classes
alter table classes enable row level security;
create policy "public read published classes" on classes for select using (is_published = true);
create policy "admins manage classes" on classes for all using (is_admin_or_editor());

-- class_sessions
alter table class_sessions enable row level security;
create policy "public read active class_sessions" on class_sessions for select using (is_active = true);
create policy "admins manage class_sessions" on class_sessions for all using (is_admin_or_editor());

-- blocked_dates
alter table blocked_dates enable row level security;
create policy "public read blocked_dates" on blocked_dates for select using (true);
create policy "admins manage blocked_dates" on blocked_dates for all using (is_admin_or_editor());

-- membership_plans
alter table membership_plans enable row level security;
create policy "public read published membership_plans" on membership_plans for select using (is_published = true);
create policy "admins manage membership_plans" on membership_plans for all using (is_admin_or_editor());

-- bookings (write-only for public)
alter table bookings enable row level security;
create policy "anon insert bookings" on bookings for insert with check (true);
create policy "staff read bookings" on bookings for select using (is_staff());
create policy "staff manage bookings" on bookings for all using (is_staff());

-- blog_categories
alter table blog_categories enable row level security;
create policy "public read blog_categories" on blog_categories for select using (true);
create policy "admins manage blog_categories" on blog_categories for all using (is_admin_or_editor());

-- blog_posts
alter table blog_posts enable row level security;
create policy "public read published blog_posts" on blog_posts for select using (status = 'published');
create policy "admins manage blog_posts" on blog_posts for all using (is_admin_or_editor());

-- foods
alter table foods enable row level security;
create policy "public read published foods" on foods for select using (is_published = true);
create policy "admins manage foods" on foods for all using (is_admin_or_editor());

-- nutrition_leads (write-only for public)
alter table nutrition_leads enable row level security;
create policy "anon insert nutrition_leads" on nutrition_leads for insert with check (true);
create policy "staff read nutrition_leads" on nutrition_leads for select using (is_staff());

-- enquiries (write-only for public)
alter table enquiries enable row level security;
create policy "anon insert enquiries" on enquiries for insert with check (true);
create policy "staff read enquiries" on enquiries for select using (is_staff());
create policy "staff manage enquiries" on enquiries for all using (is_staff());

-- faqs
alter table faqs enable row level security;
create policy "public read published faqs" on faqs for select using (is_published = true);
create policy "admins manage faqs" on faqs for all using (is_admin_or_editor());

-- gallery_images
alter table gallery_images enable row level security;
create policy "public read published gallery_images" on gallery_images for select using (is_published = true);
create policy "admins manage gallery_images" on gallery_images for all using (is_admin_or_editor());

-- newsletter_subscribers (write-only for public)
alter table newsletter_subscribers enable row level security;
create policy "anon insert newsletter_subscribers" on newsletter_subscribers for insert with check (true);
create policy "staff read newsletter_subscribers" on newsletter_subscribers for select using (is_staff());

-- profiles
alter table profiles enable row level security;
create policy "users read own profile" on profiles for select using (id = auth.uid());
create policy "admins manage profiles" on profiles for all using (
  exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- activity_log
alter table activity_log enable row level security;
create policy "staff read activity_log" on activity_log for select using (is_staff());
create policy "staff insert activity_log" on activity_log for insert with check (is_staff());

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Generate booking reference GYM-XXXXXX
create or replace function generate_booking_reference()
returns text as $$
declare
  ref text;
  exists_already boolean;
begin
  loop
    ref := 'GYM-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    select exists(select 1 from bookings where reference = ref) into exists_already;
    exit when not exists_already;
  end loop;
  return ref;
end;
$$ language plpgsql;

-- Create booking with capacity check (security definer)
create or replace function create_booking(
  p_booking_type text,
  p_class_id uuid default null,
  p_class_session_id uuid default null,
  p_instructor_id uuid default null,
  p_booking_date date default null,
  p_booking_time time default null,
  p_full_name text default null,
  p_phone text default null,
  p_email text default null,
  p_goal text default null,
  p_injuries text default null,
  p_heard_from text default null,
  p_notes text default null,
  p_amount_kes int default 0,
  p_idempotency_key text default null
)
returns jsonb as $$
declare
  v_ref text;
  v_booking_id uuid;
  v_capacity int;
  v_booked int;
  v_existing uuid;
begin
  -- Check idempotency
  if p_idempotency_key is not null then
    select id into v_existing from bookings where idempotency_key = p_idempotency_key;
    if v_existing is not null then
      return jsonb_build_object(
        'success', true,
        'booking_id', v_existing,
        'reference', (select reference from bookings where id = v_existing),
        'duplicate', true
      );
    end if;
  end if;

  -- For class bookings, check capacity
  if p_booking_type = 'class' and p_class_session_id is not null then
    -- Lock the session row
    select coalesce(cs.capacity_override, c.capacity)
    into v_capacity
    from class_sessions cs
    join classes c on c.id = cs.class_id
    where cs.id = p_class_session_id
    for update;

    if v_capacity is null then
      return jsonb_build_object('success', false, 'error', 'Session not found');
    end if;

    -- Count existing bookings for this session on this date
    select count(*) into v_booked
    from bookings
    where class_session_id = p_class_session_id
    and booking_date = p_booking_date
    and status in ('pending', 'confirmed');

    if v_booked >= v_capacity then
      return jsonb_build_object('success', false, 'error', 'This session is full');
    end if;
  end if;

  -- Generate reference
  v_ref := generate_booking_reference();

  -- Insert booking
  insert into bookings (
    reference, booking_type, class_id, class_session_id, instructor_id,
    booking_date, booking_time, full_name, phone, email,
    goal, injuries, heard_from, notes, amount_kes, idempotency_key
  ) values (
    v_ref, p_booking_type, p_class_id, p_class_session_id, p_instructor_id,
    p_booking_date, p_booking_time, p_full_name, p_phone, p_email,
    p_goal, p_injuries, p_heard_from, p_notes, p_amount_kes, p_idempotency_key
  ) returning id into v_booking_id;

  return jsonb_build_object(
    'success', true,
    'booking_id', v_booking_id,
    'reference', v_ref,
    'duplicate', false
  );
end;
$$ language plpgsql security definer;

-- Get available slots (security definer — exposes only counts, not booker info)
create or replace function get_available_slots(
  p_date date,
  p_type text default 'class',
  p_instructor_id uuid default null
)
returns jsonb as $$
declare
  v_day int;
  v_result jsonb := '[]'::jsonb;
begin
  v_day := extract(dow from p_date)::int;

  -- Check if date is blocked
  if exists (select 1 from blocked_dates where blocked_on = p_date) then
    return '[]'::jsonb;
  end if;

  if p_type = 'class' then
    select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
    into v_result
    from (
      select
        cs.id as session_id,
        cs.class_id,
        c.name as class_name,
        c.slug as class_slug,
        cs.start_time,
        c.duration_minutes,
        coalesce(cs.capacity_override, c.capacity) as capacity,
        coalesce(
          (select count(*) from bookings b
           where b.class_session_id = cs.id
           and b.booking_date = p_date
           and b.status in ('pending','confirmed')),
          0
        ) as booked,
        coalesce(cs.capacity_override, c.capacity) -
        coalesce(
          (select count(*) from bookings b
           where b.class_session_id = cs.id
           and b.booking_date = p_date
           and b.status in ('pending','confirmed')),
          0
        ) as remaining,
        i.full_name as instructor_name,
        i.slug as instructor_slug
      from class_sessions cs
      join classes c on c.id = cs.class_id
      left join instructors i on i.id = coalesce(cs.instructor_id, c.instructor_id)
      where cs.day_of_week = v_day
      and cs.is_active = true
      and c.is_published = true
      order by cs.start_time
    ) t;
  elsif p_type = 'personal_training' then
    -- Return open hours minus booked slots for the instructor
    select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
    into v_result
    from (
      select
        gs as start_time,
        (select count(*) from bookings b
         where b.booking_date = p_date
         and b.booking_time = gs::time
         and b.instructor_id = p_instructor_id
         and b.status in ('pending','confirmed')
        ) as booked
      from generate_series(
        (select opens from opening_hours where day_of_week = v_day and not is_closed),
        (select closes - interval '1 hour' from opening_hours where day_of_week = v_day and not is_closed),
        interval '1 hour'
      ) gs
      where (select count(*) from bookings b
             where b.booking_date = p_date
             and b.booking_time = gs::time
             and b.instructor_id = p_instructor_id
             and b.status in ('pending','confirmed')) = 0
    ) t;
  end if;

  return v_result;
end;
$$ language plpgsql security definer;

-- Update timestamps trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger workouts_updated_at before update on workouts
  for each row execute function update_updated_at();
create trigger bookings_updated_at before update on bookings
  for each row execute function update_updated_at();
create trigger blog_posts_updated_at before update on blog_posts
  for each row execute function update_updated_at();
create trigger site_settings_updated_at before update on site_settings
  for each row execute function update_updated_at();
