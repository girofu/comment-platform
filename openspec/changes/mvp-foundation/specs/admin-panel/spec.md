## ADDED Requirements

### Requirement: Admin dashboard with key metrics

The system SHALL provide an admin dashboard showing platform overview metrics.

#### Scenario: Dashboard displays metrics

- **WHEN** an admin navigates to /admin
- **THEN** the page SHALL display: total users, total coaches (claimed/unclaimed), total reviews by status, pending OCR reviews count, open disputes count

### Requirement: Manual PoS review queue

The system SHALL provide an admin interface to review PoS photos that failed OCR verification.

#### Scenario: Admin views pending reviews

- **WHEN** an admin navigates to the PoS review queue
- **THEN** the system SHALL list all reviews with status PENDING_ADMIN, showing the review details and a pre-signed URL to the PoS photo

#### Scenario: Admin approves PoS

- **WHEN** an admin clicks "Approve" on a PENDING_ADMIN review
- **THEN** the review status SHALL transition to PUBLISHED

#### Scenario: Admin rejects PoS

- **WHEN** an admin clicks "Reject" on a PENDING_ADMIN review
- **THEN** the review status SHALL transition to HIDDEN with a rejection reason

### Requirement: Coach claim management

The system SHALL provide an admin interface to manage coach profile claim requests.

#### Scenario: Admin views pending claims

- **WHEN** an admin navigates to the claims management page
- **THEN** the system SHALL list all pending claim requests with verification code, user details, and IG handle

#### Scenario: Admin approves claim

- **WHEN** an admin approves a claim request after verifying the IG DM
- **THEN** the system SHALL execute the claim approval flow (update profile, user role, etc.)

### Requirement: Dispute management interface

The system SHALL provide an admin interface to review and resolve disputes.

#### Scenario: Admin views open disputes

- **WHEN** an admin navigates to the disputes page
- **THEN** the system SHALL list all reviews with status DISPUTED, showing the review, dispute reason, and PoS photo

#### Scenario: Admin resolves dispute

- **WHEN** an admin resolves a dispute (uphold or reject)
- **THEN** the review status SHALL transition accordingly and both the coach and reviewer SHALL receive a notification

### Requirement: Shadowban management

The system SHALL provide an admin interface to manage shadowbanned users.

#### Scenario: Admin views flagged accounts

- **WHEN** an admin navigates to the shadowban management page
- **THEN** the system SHALL list accounts flagged by the device fingerprint detection system

#### Scenario: Admin applies shadowban

- **WHEN** an admin confirms a shadowban on a flagged account
- **THEN** the user's is_shadowbanned SHALL be set to TRUE

#### Scenario: Admin removes shadowban

- **WHEN** an admin removes a shadowban from a user
- **THEN** the user's is_shadowbanned SHALL be set to FALSE
