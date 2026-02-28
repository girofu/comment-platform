## ADDED Requirements

### Requirement: Core database tables exist

The system SHALL have Users, Coach_Profiles, and Reviews as core tables with proper UUID primary keys, timestamps, and foreign key relationships.

#### Scenario: Users table creation

- **WHEN** the database migration runs
- **THEN** a Users table EXISTS with columns: id (UUID PK), sso_provider, email (UNIQUE), phone_number (UNIQUE NULL), role (user_role ENUM), trust_score (INT DEFAULT 0), device_fingerprint, is_shadowbanned (BOOLEAN DEFAULT FALSE), created_at, updated_at

#### Scenario: Coach_Profiles table creation

- **WHEN** the database migration runs
- **THEN** a Coach_Profiles table EXISTS with columns: id (UUID PK), display_name, slug (UNIQUE), bio, specialties (TEXT[]), ig_handle, is_claimed (BOOLEAN DEFAULT FALSE), claimed_by (UUID FK to Users NULL), claimed_at, phone_hash (VARCHAR NULL), is_pro (BOOLEAN DEFAULT FALSE), created_at, updated_at

#### Scenario: Reviews table creation

- **WHEN** the database migration runs
- **THEN** a Reviews table EXISTS with columns: id (UUID PK), student_id (UUID FK to Users), coach_profile_id (UUID FK to Coach_Profiles), status (review_status ENUM DEFAULT 'INCOMPLETE'), score_overall, score_professional, score_emotional, score_communication (all INT CHECK 0-5), comment (TEXT), proof_photo_url, proof_photo_hash (UNIQUE NULL), is_anonymous (BOOLEAN DEFAULT FALSE), coach_official_reply (TEXT NULL), is_pinned_by_coach (BOOLEAN DEFAULT FALSE), created_at, updated_at

### Requirement: Custom enum types are defined

The system SHALL define PostgreSQL enum types for structured status and role fields.

#### Scenario: user_role enum exists

- **WHEN** the database migration runs
- **THEN** a user_role ENUM type EXISTS with values: 'STUDENT', 'COACH', 'ADMIN'

#### Scenario: review_status enum exists

- **WHEN** the database migration runs
- **THEN** a review_status ENUM type EXISTS with values: 'INCOMPLETE', 'PENDING_OCR', 'PENDING_ADMIN', 'PENDING_COACH', 'PUBLISHED', 'DISPUTED', 'HIDDEN'

### Requirement: Row Level Security policies enforce access control

The system SHALL enforce RLS on all core tables to restrict data access based on user identity and role.

#### Scenario: Users can only read their own profile

- **WHEN** a logged-in user queries the Users table
- **THEN** they SHALL only see their own row (WHERE id = auth.uid())

#### Scenario: Reviews visibility depends on coach claim status

- **WHEN** an unauthenticated user queries Reviews for an unclaimed coach
- **THEN** the query SHALL return zero rows
- **WHEN** an authenticated user queries Reviews for an unclaimed coach
- **THEN** the query SHALL return published reviews
- **WHEN** any user queries Reviews for a claimed coach
- **THEN** the query SHALL return published reviews

#### Scenario: Admin can read all data

- **WHEN** a user with role 'ADMIN' queries any table
- **THEN** they SHALL see all rows without restriction

### Requirement: Database indexes support query performance

The system SHALL create indexes on frequently queried columns.

#### Scenario: Coach profile lookup by slug

- **WHEN** the database migration runs
- **THEN** an index EXISTS on Coach_Profiles.slug

#### Scenario: Reviews lookup by coach and status

- **WHEN** the database migration runs
- **THEN** a composite index EXISTS on Reviews(coach_profile_id, status)

#### Scenario: Reviews lookup by student

- **WHEN** the database migration runs
- **THEN** an index EXISTS on Reviews.student_id
