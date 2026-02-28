## ADDED Requirements

### Requirement: Coach profile page displays coach information

The system SHALL display a public coach profile page with coach details, ratings, and reviews.

#### Scenario: Claimed coach profile page

- **WHEN** a user navigates to /coaches/{slug} for a claimed coach
- **THEN** the page SHALL display: display_name, bio, specialties, dual-track ratings, and all published reviews

#### Scenario: Unclaimed coach profile page

- **WHEN** an unauthenticated user navigates to /coaches/{slug} for an unclaimed coach
- **THEN** the page SHALL display the coach name with a FOMO banner showing review count but SHALL NOT display individual reviews

#### Scenario: Unclaimed coach profile for authenticated user

- **WHEN** an authenticated user navigates to /coaches/{slug} for an unclaimed coach
- **THEN** the page SHALL display all published reviews in addition to the FOMO banner

### Requirement: Dual-track rating calculation

The system SHALL calculate and display two separate ratings: historical average and recent 6-month average.

#### Scenario: Historical rating calculation

- **WHEN** the coach profile page loads
- **THEN** the system SHALL display the weighted average of all PUBLISHED reviews' score_overall, weighted by each reviewer's trust_score

#### Scenario: Recent rating calculation

- **WHEN** the coach profile page loads
- **THEN** the system SHALL display the weighted average of PUBLISHED reviews from the last 6 months with a fire emoji indicator

#### Scenario: Insufficient recent reviews

- **WHEN** a coach has fewer than 3 reviews in the last 6 months
- **THEN** the recent rating section SHALL display "Not enough recent reviews" instead of a numeric rating

### Requirement: FOMO mechanism drives coach claiming

The system SHALL display prominent FOMO elements on unclaimed coach profiles to incentivize claiming.

#### Scenario: FOMO banner on unclaimed profile

- **WHEN** an unclaimed coach profile page is viewed
- **THEN** the page SHALL display a banner showing the number of pending reviews (e.g., "This coach has 15 real student reviews waiting to be unlocked")

#### Scenario: Search engine exclusion for unclaimed profiles

- **WHEN** a search engine crawls an unclaimed coach profile
- **THEN** the page SHALL include noindex meta tag to prevent search engine indexing

#### Scenario: Claimed profile is indexed

- **WHEN** a search engine crawls a claimed coach profile
- **THEN** the page SHALL NOT include noindex meta tag, allowing search engine indexing

### Requirement: Pinned reviews for Pro coaches

The system SHALL allow Pro-subscription coaches to pin up to 3 published reviews to the top of their profile.

#### Scenario: Pin a review

- **WHEN** a Pro coach selects a published review to pin AND has fewer than 3 pinned reviews
- **THEN** the review's is_pinned_by_coach SHALL be set to TRUE and it SHALL appear at the top of the reviews list

#### Scenario: Pin limit enforcement

- **WHEN** a Pro coach attempts to pin a 4th review
- **THEN** the system SHALL reject the action with a message indicating the pin limit has been reached

#### Scenario: Non-Pro coach cannot pin

- **WHEN** a non-Pro coach attempts to pin a review
- **THEN** the system SHALL reject the action with a message indicating this is a Pro feature
