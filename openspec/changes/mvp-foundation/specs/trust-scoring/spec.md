## ADDED Requirements

### Requirement: New accounts start in sandbox with zero trust

The system SHALL assign trust_score=0 to all new accounts and treat their first 3 reviews with weight 0 in rating calculations.

#### Scenario: New user trust score initialization

- **WHEN** a new user registers via SSO
- **THEN** the user's trust_score SHALL be 0

#### Scenario: Sandbox reviews do not affect coach rating

- **WHEN** a user with fewer than 3 published reviews submits a review
- **THEN** the review SHALL be stored and published but SHALL NOT contribute to the coach's weighted average rating

#### Scenario: Post-sandbox reviews contribute normally

- **WHEN** a user with 3 or more published reviews submits a new review
- **THEN** the review SHALL contribute to the coach's weighted average rating with weight proportional to trust_score

### Requirement: Trust score increases with verified activity

The system SHALL increase trust_score when users bind additional verification methods or receive coach acknowledgments.

#### Scenario: Phone number binding increases trust

- **WHEN** a user verifies their phone number via OTP
- **THEN** the user's trust_score SHALL increase by 10 points

#### Scenario: Coach acknowledgment increases trust

- **WHEN** a coach confirms they had a session with a reviewer (via PENDING_COACH status)
- **THEN** the reviewer's trust_score SHALL increase by 5 points

### Requirement: Device fingerprint tracks user devices

The system SHALL collect and store browser device fingerprints to detect Sybil attacks.

#### Scenario: Fingerprint recorded on login

- **WHEN** a user logs in from a browser
- **THEN** the system SHALL collect the device fingerprint via FingerprintJS and store it in the Users table

#### Scenario: Fingerprint mismatch detection

- **WHEN** multiple accounts share the same device_fingerprint AND submit reviews for the same coach within 7 days
- **THEN** the system SHALL flag these accounts for Shadowban review

### Requirement: Shadowban silently hides malicious reviews

The system SHALL implement shadowban to silently suppress reviews from flagged accounts without notifying the user.

#### Scenario: Shadowbanned user submits review

- **WHEN** a shadowbanned user (is_shadowbanned=TRUE) submits a review
- **THEN** the review SHALL be saved with status='HIDDEN' but the UI SHALL display success feedback as if the review was published

#### Scenario: Shadowban does not affect existing published reviews

- **WHEN** a user is shadowbanned
- **THEN** their previously published reviews SHALL remain visible (no retroactive hiding)
