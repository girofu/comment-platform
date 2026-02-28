## ADDED Requirements

### Requirement: PoS photos are stored in a private bucket

The system SHALL store all Proof of Service photos in a Supabase Storage private bucket, never in a public bucket.

#### Scenario: Photo upload to private bucket

- **WHEN** a user uploads a PoS photo
- **THEN** the system SHALL store the file in the 'pos-photos' private bucket with path format: {user_id}/{review_id}/{filename}

#### Scenario: Direct URL access is denied

- **WHEN** anyone attempts to access a PoS photo via direct URL without authentication
- **THEN** the request SHALL return 403 Forbidden

### Requirement: Pre-signed URLs provide time-limited access

The system SHALL generate pre-signed URLs with 5-minute expiration for authorized viewing of PoS photos.

#### Scenario: Authorized admin views PoS photo

- **WHEN** an admin requests to view a PoS photo for review
- **THEN** the system SHALL generate a pre-signed URL valid for 5 minutes

#### Scenario: Pre-signed URL expiration

- **WHEN** a pre-signed URL is accessed after 5 minutes
- **THEN** the request SHALL return 403 Forbidden

### Requirement: SHA-256 hash is computed and stored before upload completes

The system SHALL compute a SHA-256 hash of every uploaded PoS photo and store it in proof_photo_hash.

#### Scenario: Hash computation on upload

- **WHEN** a user uploads a PoS photo
- **THEN** the system SHALL compute the SHA-256 hash of the file and store it in Reviews.proof_photo_hash

#### Scenario: Duplicate photo detection

- **WHEN** a user uploads a photo whose SHA-256 hash matches an existing proof_photo_hash in the database
- **THEN** the system SHALL reject the upload with an error message indicating the photo has already been used

### Requirement: Photos are hard-deleted after 30 days

The system SHALL permanently delete PoS photo files from storage 30 days after the review reaches PUBLISHED status or dispute resolution.

#### Scenario: Scheduled deletion after publication

- **WHEN** a review has been in PUBLISHED status for 30 days
- **THEN** the system SHALL delete the physical photo file from Supabase Storage and set proof_photo_url to NULL

#### Scenario: Hash preserved after deletion

- **WHEN** a PoS photo is hard-deleted
- **THEN** the proof_photo_hash value SHALL remain in the database permanently for future duplicate detection

#### Scenario: Disputed review delays deletion

- **WHEN** a review enters DISPUTED status
- **THEN** the 30-day deletion timer SHALL pause and only resume when the dispute is resolved
