## ADDED Requirements

### Requirement: Conversational review interface guides users step-by-step

The system SHALL present review submission as an interactive chatbot-style conversation rather than a traditional form.

#### Scenario: Review conversation starts

- **WHEN** a user initiates a review for a coach
- **THEN** the system SHALL display a conversational UI that asks structured questions one at a time (e.g., "How would you rate this coach's professional knowledge?")

#### Scenario: Star rating input within conversation

- **WHEN** the chatbot asks a rating question
- **THEN** the user SHALL be able to tap/click star ratings (1-5) inline within the conversation

#### Scenario: Free-text comment input

- **WHEN** the chatbot asks "Anything you'd like to add?"
- **THEN** the user SHALL be able to type free-text comments in a text input area

### Requirement: Reviews are saved as drafts during conversation

The system SHALL save incomplete reviews as drafts (status='INCOMPLETE') so users can resume later.

#### Scenario: Auto-save during conversation

- **WHEN** a user completes at least one rating question
- **THEN** the system SHALL save the partial review to the database with status='INCOMPLETE'

#### Scenario: Resume incomplete review

- **WHEN** a user returns to review a coach they have an INCOMPLETE review for
- **THEN** the system SHALL resume the conversation from where they left off

### Requirement: Review status transitions follow defined state machine

The system SHALL enforce the review status machine: INCOMPLETE -> PENDING_OCR -> PUBLISHED (or PENDING_ADMIN -> PUBLISHED), with DISPUTED and HIDDEN as terminal states.

#### Scenario: Transition from INCOMPLETE to PENDING_OCR

- **WHEN** a user completes all rating questions AND uploads a PoS photo
- **THEN** the review status SHALL transition from INCOMPLETE to PENDING_OCR

#### Scenario: Transition from PENDING_OCR to PUBLISHED

- **WHEN** the OCR system successfully verifies the PoS photo
- **THEN** the review status SHALL transition from PENDING_OCR to PUBLISHED

#### Scenario: Transition from PENDING_OCR to PENDING_ADMIN

- **WHEN** the OCR system fails to verify the PoS photo
- **THEN** the review status SHALL transition from PENDING_OCR to PENDING_ADMIN

#### Scenario: Transition from PENDING_ADMIN to PUBLISHED

- **WHEN** an admin manually approves the PoS photo
- **THEN** the review status SHALL transition from PENDING_ADMIN to PUBLISHED

### Requirement: One review per student per coach

The system SHALL prevent a student from submitting multiple reviews for the same coach.

#### Scenario: Duplicate review prevention

- **WHEN** a user attempts to create a review for a coach they already have a PUBLISHED review for
- **THEN** the system SHALL display a message indicating they have already reviewed this coach

#### Scenario: Incomplete review does not block new attempt

- **WHEN** a user has an INCOMPLETE review for a coach
- **THEN** the system SHALL redirect them to complete the existing draft rather than creating a new one
