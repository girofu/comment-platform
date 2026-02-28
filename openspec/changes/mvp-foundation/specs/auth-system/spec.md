## ADDED Requirements

### Requirement: SSO login with Google and Apple

The system SHALL support user login via Google and Apple SSO through Supabase Auth.

#### Scenario: Google SSO login

- **WHEN** a user clicks "Login with Google"
- **THEN** the system SHALL redirect to Google OAuth flow and create/update a Supabase Auth user upon successful authentication

#### Scenario: Apple SSO login

- **WHEN** a user clicks "Login with Apple"
- **THEN** the system SHALL redirect to Apple OAuth flow and create/update a Supabase Auth user upon successful authentication

#### Scenario: New user auto-registration

- **WHEN** a user completes SSO for the first time
- **THEN** the system SHALL create a row in the Users table with role='STUDENT', trust_score=0, and the SSO email

### Requirement: Session management with Supabase Auth

The system SHALL manage user sessions using Supabase Auth tokens with automatic refresh.

#### Scenario: Session persistence across page refreshes

- **WHEN** a logged-in user refreshes the page
- **THEN** the session SHALL persist via Supabase Auth cookie-based session management

#### Scenario: Session expiration

- **WHEN** a user's session token expires and cannot be refreshed
- **THEN** the system SHALL redirect the user to the login page

#### Scenario: Logout

- **WHEN** a user clicks "Logout"
- **THEN** the system SHALL invalidate the session and redirect to the home page

### Requirement: Role-based access control via app_metadata

The system SHALL store user roles (STUDENT, COACH, ADMIN) in Supabase Auth app_metadata for RLS integration.

#### Scenario: Default role assignment

- **WHEN** a new user registers
- **THEN** the system SHALL set app_metadata.role to 'STUDENT'

#### Scenario: Role upgrade to COACH

- **WHEN** a user successfully claims a coach profile
- **THEN** the system SHALL update app_metadata.role to 'COACH'

#### Scenario: RLS reads role from JWT

- **WHEN** a database query is executed with RLS
- **THEN** the RLS policy SHALL read the user's role from auth.jwt()->'app_metadata'->>'role'

### Requirement: Auth middleware protects routes

The system SHALL use Next.js middleware to protect authenticated routes.

#### Scenario: Unauthenticated access to protected route

- **WHEN** an unauthenticated user navigates to /dashboard or /review/\*
- **THEN** the system SHALL redirect to the login page with a return URL parameter

#### Scenario: Non-admin access to admin route

- **WHEN** a user without 'ADMIN' role navigates to /admin/\*
- **THEN** the system SHALL return a 403 Forbidden response
