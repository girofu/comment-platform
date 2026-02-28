## ADDED Requirements

### Requirement: Coach official reply on reviews

The system SHALL allow coaches to post one official reply per review, displayed prominently below the review.

#### Scenario: Coach posts official reply

- **WHEN** a coach writes a reply to a published review on their profile
- **THEN** the reply SHALL be stored in Reviews.coach_official_reply and displayed with a "Coach Official Reply" badge

#### Scenario: One reply per review limit

- **WHEN** a coach attempts to reply to a review that already has an official reply
- **THEN** the system SHALL reject the action (no editing of existing replies)

#### Scenario: Only profile owner can reply

- **WHEN** a user who is NOT the claimed owner of the coach profile attempts to post a reply
- **THEN** the system SHALL return 403 Forbidden

### Requirement: Dispute flow for objective violations only

The system SHALL allow coaches to dispute reviews only on objective grounds: forged evidence, personal attacks, or privacy violations.

#### Scenario: Coach initiates dispute

- **WHEN** a coach clicks "Report" on a review and selects a violation type (FORGED_EVIDENCE, PERSONAL_ATTACK, PRIVACY_VIOLATION)
- **THEN** the review status SHALL transition to DISPUTED and an admin notification SHALL be created

#### Scenario: Subjective complaints are rejected

- **WHEN** a coach attempts to dispute a review with reason "low score" or "unfair rating"
- **THEN** the system SHALL display a message explaining that subjective disagreements are not grounds for dispute

#### Scenario: Admin resolves dispute - upheld

- **WHEN** an admin reviews a dispute and determines the violation is valid
- **THEN** the review status SHALL transition to HIDDEN

#### Scenario: Admin resolves dispute - rejected

- **WHEN** an admin reviews a dispute and determines the violation is not valid
- **THEN** the review status SHALL transition back to PUBLISHED

### Requirement: Legal takedown with documentation

The system SHALL support review takedown only upon receipt of formal legal documentation.

#### Scenario: Legal takedown request

- **WHEN** an admin receives a formal legal document (police report, lawyer letter, or court order)
- **THEN** the admin SHALL be able to transition the review status to HIDDEN with a legal_reference note

#### Scenario: Legal documentation is required

- **WHEN** a coach or third party requests takedown without formal documentation
- **THEN** the system SHALL reject the request and inform them of the documentation requirements
