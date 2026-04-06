create table users (
    id uuid primary key,
    name varchar(120) not null,
    email varchar(160) not null unique,
    password_hash varchar(255) not null,
    phone varchar(32) not null,
    role varchar(20) not null check (role in ('CLIENT', 'ADMIN')),
    status varchar(20) not null check (status in ('ACTIVE', 'INACTIVE')),
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create table destinations (
    id uuid primary key,
    name varchar(120) not null,
    slug varchar(140) not null unique,
    description text not null,
    city varchar(100) not null,
    state varchar(100) not null,
    country varchar(100) not null,
    category varchar(80) not null,
    featured_image_url varchar(500) not null,
    status varchar(20) not null check (status in ('ACTIVE', 'INACTIVE')),
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create table hotels (
    id uuid primary key,
    destination_id uuid not null references destinations(id),
    name varchar(140) not null,
    description text not null,
    address varchar(240) not null,
    category varchar(80) not null,
    amenities text not null,
    contact_phone varchar(32) not null,
    contact_email varchar(160) not null,
    status varchar(20) not null check (status in ('ACTIVE', 'INACTIVE')),
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create table rooms (
    id uuid primary key,
    hotel_id uuid not null references hotels(id),
    name varchar(120) not null,
    type varchar(80) not null,
    description text not null,
    capacity integer not null check (capacity > 0),
    price_per_night numeric(12,2) not null check (price_per_night > 0),
    quantity integer not null check (quantity > 0),
    status varchar(20) not null check (status in ('ACTIVE', 'INACTIVE')),
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create table reservations (
    id uuid primary key,
    user_id uuid not null references users(id),
    hotel_id uuid not null references hotels(id),
    room_id uuid not null references rooms(id),
    check_in_date date not null,
    check_out_date date not null,
    guest_count integer not null check (guest_count > 0),
    total_amount numeric(12,2) not null check (total_amount >= 0),
    status varchar(20) not null check (status in ('CONFIRMED', 'CANCELLED')),
    created_at timestamptz not null,
    updated_at timestamptz not null,
    cancelled_at timestamptz null,
    check (check_out_date > check_in_date)
);

create table audit_logs (
    id uuid primary key,
    actor_id uuid not null references users(id),
    action varchar(120) not null,
    entity_type varchar(80) not null,
    entity_id uuid not null,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null
);

create index idx_destinations_status_name on destinations(status, name);
create index idx_hotels_destination_status_name on hotels(destination_id, status, name);
create index idx_hotels_status_name on hotels(status, name);
create index idx_rooms_hotel_status_name on rooms(hotel_id, status, name);
create index idx_reservations_user_created on reservations(user_id, created_at desc);
create index idx_reservations_hotel_dates on reservations(hotel_id, check_in_date, check_out_date);
create index idx_reservations_room_status_dates on reservations(room_id, status, check_in_date, check_out_date);
create index idx_audit_logs_entity_created on audit_logs(entity_type, entity_id, created_at desc);
