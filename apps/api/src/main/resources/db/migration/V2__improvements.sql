-- ============================================================
-- V2: Hotel & Travel Package Platform Improvements
-- Features:
--   1. Extended reservation lifecycle (PENDING, CHECKED_IN, CHECKED_OUT, NO_SHOW)
--   2. Booking source tracking (DIRECT, BOOKING_COM, EXPEDIA, AIRBNB)
--   3. Hotel & room image URLs
--   4. Travel packages module
--   5. Analytics-ready indexes
-- ============================================================

-- 1. Extend reservation status constraint
alter table reservations drop constraint if exists reservations_status_check;
alter table reservations add constraint reservations_status_check
    check (status in ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'NO_SHOW', 'CANCELLED'));

-- 2. Add check-in/check-out timestamps
alter table reservations add column checked_in_at  timestamptz null;
alter table reservations add column checked_out_at timestamptz null;

-- 3. Booking source (default DIRECT to keep existing rows valid)
alter table reservations add column booking_source varchar(30) not null default 'DIRECT'
    check (booking_source in ('DIRECT', 'BOOKING_COM', 'EXPEDIA', 'AIRBNB', 'OTHER'));

-- 4. Hotel image URLs (JSON-encoded list, same pattern as amenities)
alter table hotels add column image_urls text not null default '[]';

-- 5. Room image URLs
alter table rooms add column image_urls text not null default '[]';

-- 6. Travel packages table
create table travel_packages (
    id                  uuid primary key,
    hotel_id            uuid not null references hotels(id),
    name                varchar(160) not null,
    description         text not null,
    highlighted_services text not null default '[]',
    discount_percentage numeric(5,2) not null default 0.00
        check (discount_percentage >= 0 and discount_percentage < 100),
    valid_from          date not null,
    valid_to            date not null,
    status              varchar(20) not null check (status in ('ACTIVE', 'INACTIVE')),
    created_at          timestamptz not null,
    updated_at          timestamptz not null,
    check (valid_to > valid_from)
);

-- Indexes for new tables and columns
create index idx_reservations_status_checkin  on reservations(status, check_in_date);
create index idx_reservations_booking_source  on reservations(booking_source);
create index idx_travel_packages_hotel_status on travel_packages(hotel_id, status);
create index idx_travel_packages_status_dates on travel_packages(status, valid_from, valid_to);
