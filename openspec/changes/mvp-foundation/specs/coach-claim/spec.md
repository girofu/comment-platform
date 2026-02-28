## ADDED Requirements

### Requirement: Coach claim flow with verification code

The system SHALL generate a unique verification code when a coach initiates a profile claim, to be verified via IG direct message.

#### Scenario: Initiate claim

- **WHEN** a logged-in user clicks "Claim this profile" on an unclaimed coach profile
- **THEN** the system SHALL generate a unique 8-character verification code and display instructions to send it via IG DM to the platform's official account

#### Scenario: Manual verification (MVP)

- **WHEN** a coach sends the verification code via IG DM
- **THEN** an admin SHALL manually verify the code in the admin panel and approve the claim

#### Scenario: Claim approval

- **WHEN** an admin approves a coach claim
- **THEN** the system SHALL set Coach_Profiles.is_claimed=TRUE, claimed_by=user_id, claimed_at=NOW(), and update the user's role to 'COACH'

#### Scenario: Duplicate claim prevention

- **WHEN** a user attempts to claim a profile that is already claimed
- **THEN** the system SHALL reject the claim with an error message

### Requirement: Phone OTP binding for coach deduplication

The system SHALL require coaches to bind a phone number via OTP after claiming, to enable profile deduplication.

#### Scenario: OTP verification after claim

- **WHEN** a coach successfully claims a profile
- **THEN** the system SHALL prompt them to verify a phone number via SMS OTP

#### Scenario: Phone hash storage

- **WHEN** a coach verifies their phone number
- **THEN** the system SHALL store a hashed version of the phone number in Coach_Profiles.phone_hash (NOT the raw number)

#### Scenario: Auto-merge detection

- **WHEN** a coach claims a profile AND their phone_hash matches an existing claimed profile's phone_hash
- **THEN** the system SHALL flag both profiles for admin review for potential merge

### Requirement: Profile merge for duplicate coaches

The system SHALL support merging duplicate coach profiles when identified through phone deduplication.

#### Scenario: Admin initiates merge

- **WHEN** an admin identifies two coach profiles with the same phone_hash
- **THEN** the admin SHALL be able to merge them, transferring all reviews from the secondary profile to the primary

#### Scenario: Review transfer during merge

- **WHEN** two profiles are merged
- **THEN** all reviews from the secondary profile SHALL be re-linked to the primary profile's coach_profile_id and the secondary profile SHALL be soft-deleted
