-- Astro-Menu outreach: the prospect database.
--
-- Apply with:  psql "$DATABASE_URL" -f db/schema.sql
-- Safe to re-run; every statement is IF NOT EXISTS or CREATE OR REPLACE.
--
-- One rule shapes the whole schema: a venue is a business, not a person. We
-- store what a business publishes about itself — its name, its address, the
-- menu on its own website. Personal data beyond a business contact address has
-- no place here, and `deleted_at` exists so an opt-out is honoured permanently
-- rather than being re-sourced on the next sweep.

-- ---------------------------------------------------------------------------
-- Venues: one row per Google place_id.
--
-- Google's terms let us keep place_id indefinitely but not most other Places
-- fields, so everything except place_id is treated as a cache with a
-- refreshed_at stamp — see src/sources/places.js.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS venues (
	id                BIGSERIAL PRIMARY KEY,
	place_id          TEXT NOT NULL UNIQUE,
	name              TEXT NOT NULL,
	slug              TEXT NOT NULL UNIQUE,
	primary_type      TEXT,
	emirate           TEXT,
	city              TEXT,
	address           TEXT,
	lat               DOUBLE PRECISION,
	lng               DOUBLE PRECISION,
	phone             TEXT,
	website           TEXT,
	maps_url          TEXT,
	rating            NUMERIC(2, 1),
	rating_count      INTEGER,
	price_level       TEXT,
	business_status   TEXT,
	photo_names       TEXT[] NOT NULL DEFAULT '{}',

	-- Filled by the qualifier. `score` is what we sort a send batch by.
	score             INTEGER,
	score_reasons     JSONB NOT NULL DEFAULT '[]'::JSONB,
	-- prospect | chain | competitor | unreachable | disqualified
	segment           TEXT,

	-- Set when a venue asks never to be contacted again. Honoured forever:
	-- the sourcing step skips any place_id already carrying this.
	opted_out_at      TIMESTAMPTZ,
	deleted_at        TIMESTAMPTZ,

	refreshed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS venues_segment_score_idx
	ON venues (segment, score DESC NULLS LAST)
	WHERE deleted_at IS NULL AND opted_out_at IS NULL;
CREATE INDEX IF NOT EXISTS venues_emirate_idx ON venues (emirate);

-- ---------------------------------------------------------------------------
-- Menu sources: the artifacts we found that we might be able to parse.
-- A venue can have several (a PDF plus three photos of a printed card).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS menu_sources (
	id            BIGSERIAL PRIMARY KEY,
	venue_id      BIGINT NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
	-- pdf | image | html | none
	kind          TEXT NOT NULL,
	url           TEXT NOT NULL,
	-- Where we found it: website | instagram | places | manual
	discovered_on TEXT NOT NULL,
	bytes         INTEGER,
	content_hash  TEXT,
	fetched_at    TIMESTAMPTZ,
	created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	UNIQUE (venue_id, url)
);

CREATE INDEX IF NOT EXISTS menu_sources_venue_idx ON menu_sources (venue_id);

-- ---------------------------------------------------------------------------
-- Builds: one attempt at turning a venue's menu into a live Astro-Menu menu.
--
-- `review_state` is the gate that keeps a wrong price out of an inbox. Nothing
-- is ever sent from a build that a human has not moved to 'approved'.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS builds (
	id                    BIGSERIAL PRIMARY KEY,
	venue_id              BIGINT NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
	menu_source_id        BIGINT REFERENCES menu_sources (id) ON DELETE SET NULL,

	-- pending | parsed | written | rendered | failed
	state                 TEXT NOT NULL DEFAULT 'pending',
	-- unreviewed | approved | rejected
	review_state          TEXT NOT NULL DEFAULT 'unreviewed',

	parsed_menu           JSONB,
	section_count         INTEGER,
	item_count            INTEGER,
	-- The model's own reading of how confident it is, 0-100, plus the notes it
	-- attached. Low confidence goes to the top of the review queue.
	parse_confidence      INTEGER,
	parse_notes           TEXT,

	business_profile_id   TEXT,
	menu_id               TEXT,
	menu_url              TEXT,
	qr_path               TEXT,
	screenshot_path       TEXT,

	model                 TEXT,
	input_tokens          INTEGER,
	output_tokens         INTEGER,
	error                 TEXT,

	created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS builds_venue_idx ON builds (venue_id);
CREATE INDEX IF NOT EXISTS builds_review_idx ON builds (review_state, state);

-- ---------------------------------------------------------------------------
-- Messages: what we sent, when, on which channel.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
	id            BIGSERIAL PRIMARY KEY,
	venue_id      BIGINT NOT NULL REFERENCES venues (id) ON DELETE CASCADE,
	build_id      BIGINT REFERENCES builds (id) ON DELETE SET NULL,
	-- email | whatsapp | card | call
	channel       TEXT NOT NULL,
	-- Which touch in the sequence: 1..4
	step          INTEGER NOT NULL DEFAULT 1,
	to_address    TEXT,
	subject       TEXT,
	body          TEXT,
	sent_at       TIMESTAMPTZ,
	replied_at    TIMESTAMPTZ,
	bounced_at    TIMESTAMPTZ,
	created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_venue_idx ON messages (venue_id, step);

-- ---------------------------------------------------------------------------
-- Events: the funnel. Everything measurable lands here as one row.
--
-- The event that matters most is 'menu_scanned' — a venue opening the QR of
-- the menu we built for them is the hottest buying signal in the pipeline.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
	id          BIGSERIAL PRIMARY KEY,
	venue_id    BIGINT REFERENCES venues (id) ON DELETE CASCADE,
	-- sourced | qualified | menu_found | built | approved | sent | opened
	-- | link_clicked | menu_scanned | replied | claimed | trial_started
	-- | subscribed | opted_out
	kind        TEXT NOT NULL,
	detail      JSONB NOT NULL DEFAULT '{}'::JSONB,
	occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_kind_idx ON events (kind, occurred_at DESC);
CREATE INDEX IF NOT EXISTS events_venue_idx ON events (venue_id);

-- ---------------------------------------------------------------------------
-- The funnel, as one query. Every stage counts distinct venues, so a venue
-- that was emailed four times still counts once.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW funnel AS
SELECT kind, COUNT(DISTINCT venue_id) AS venues, MAX(occurred_at) AS latest
FROM events
GROUP BY kind;
