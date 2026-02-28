## 1. Database Schema & Migration

- [ ] 1.1 Create Supabase migration for user_role and review_status enum types
- [ ] 1.2 Create Supabase migration for Users table with trust_score, device_fingerprint, is_shadowbanned columns
- [ ] 1.3 Create Supabase migration for Coach_Profiles table with slug, is_claimed, claimed_by, phone_hash, is_pro columns
- [ ] 1.4 Create Supabase migration for Reviews table with structured scores, proof_photo_hash, coach_official_reply, is_pinned_by_coach columns
- [ ] 1.5 Create indexes on Coach_Profiles.slug, Reviews(coach_profile_id, status), Reviews.student_id
- [ ] 1.6 Create RLS policies for Users table (self-read, admin-all)
- [ ] 1.7 Create RLS policies for Coach_Profiles table (public-read for claimed, authenticated-read for unclaimed)
- [ ] 1.8 Create RLS policies for Reviews table (visibility based on coach claim status and user auth)
- [ ] 1.9 Generate TypeScript types from Supabase schema (pnpm db:gen-types)

## 2. Authentication System

- [ ] 2.1 Configure Supabase Auth providers (Google, Apple SSO)
- [ ] 2.2 Create Supabase client utilities (browser client, server client, middleware client)
- [ ] 2.3 Implement auth callback route handler (/api/auth/callback)
- [ ] 2.4 Create login page with Google/Apple SSO buttons
- [ ] 2.5 Implement Next.js middleware for route protection (auth routes, admin routes)
- [ ] 2.6 Create auth context/hooks for client-side session management
- [ ] 2.7 Implement auto-registration: create Users row on first SSO login with role=STUDENT, trust_score=0
- [ ] 2.8 Implement logout flow with session invalidation

## 3. Trust Scoring & Device Fingerprint

- [ ] 3.1 Install and configure FingerprintJS open-source library
- [ ] 3.2 Create client-side fingerprint collection hook (collect on login)
- [ ] 3.3 Create server action to store device_fingerprint in Users table
- [ ] 3.4 Implement trust_score calculation logic (phone verification +10, coach acknowledgment +5)
- [ ] 3.5 Implement sandbox check: reviews from users with <3 published reviews have weight=0 in rating calculations
- [ ] 3.6 Create Sybil detection logic: flag accounts sharing fingerprint with reviews for same coach within 7 days
- [ ] 3.7 Implement shadowban logic: shadowbanned users' new reviews auto-set to HIDDEN with fake success UI

## 4. Coach Profile Pages

- [ ] 4.1 Create Coach_Profiles CRUD server actions (create, read, update)
- [ ] 4.2 Build coach profile page at /coaches/[slug] with Server Components
- [ ] 4.3 Implement dual-track rating calculation (historical weighted average + 6-month weighted average)
- [ ] 4.4 Build FOMO banner component for unclaimed profiles (review count display)
- [ ] 4.5 Implement noindex meta tag logic for unclaimed profiles
- [ ] 4.6 Build reviews list component with sorting (newest, highest, lowest)
- [ ] 4.7 Implement pinned reviews display for Pro coaches (up to 3, labeled "Coach's Pick")
- [ ] 4.8 Build coach search page at /search with filters (specialty, location)

## 5. Conversational Review Flow

- [ ] 5.1 Create review submission page at /review/[coachSlug]
- [ ] 5.2 Build chatbot-style conversational UI component with step-by-step questions
- [ ] 5.3 Implement inline star rating component within conversation
- [ ] 5.4 Create server actions for review CRUD (create draft, update scores, submit)
- [ ] 5.5 Implement auto-save: partial reviews saved as INCOMPLETE on each step
- [ ] 5.6 Implement resume: redirect to existing INCOMPLETE review if one exists
- [ ] 5.7 Implement duplicate prevention: block new review if PUBLISHED review exists for same coach
- [ ] 5.8 Build review state machine transitions (INCOMPLETE → PENDING_OCR → PUBLISHED)

## 6. Proof of Service (PoS) Management

- [ ] 6.1 Create Supabase Storage private bucket 'pos-photos' with RLS
- [ ] 6.2 Build photo upload component with drag-and-drop and preview
- [ ] 6.3 Implement SHA-256 hash computation on upload (server-side)
- [ ] 6.4 Implement duplicate photo detection (reject if hash exists in database)
- [ ] 6.5 Create server action for generating 5-minute pre-signed URLs
- [ ] 6.6 Implement status transition: INCOMPLETE → PENDING_OCR after photo upload
- [ ] 6.7 Create pg_cron job for 30-day hard deletion of PoS photos (set proof_photo_url=NULL, keep hash)
- [ ] 6.8 Implement deletion pause for DISPUTED reviews

## 7. Coach Claim & Deduplication

- [ ] 7.1 Build "Claim this profile" button and verification code generation
- [ ] 7.2 Create claim request page showing IG DM instructions with verification code
- [ ] 7.3 Implement claim approval server action (set is_claimed, claimed_by, update user role)
- [ ] 7.4 Implement phone OTP verification flow after claim approval
- [ ] 7.5 Store hashed phone number in Coach_Profiles.phone_hash
- [ ] 7.6 Implement auto-merge detection: flag profiles with matching phone_hash
- [ ] 7.7 Build admin merge interface for duplicate coach profiles

## 8. Dispute System & Coach Reply

- [ ] 8.1 Build coach official reply component (one reply per review, "Coach Official Reply" badge)
- [ ] 8.2 Implement reply server action with ownership validation
- [ ] 8.3 Build dispute report form with violation type selection (FORGED_EVIDENCE, PERSONAL_ATTACK, PRIVACY_VIOLATION)
- [ ] 8.4 Implement dispute submission server action (transition to DISPUTED status)
- [ ] 8.5 Implement dispute resolution server actions (uphold → HIDDEN, reject → PUBLISHED)
- [ ] 8.6 Create notification system for dispute resolution outcomes

## 9. Admin Panel

- [ ] 9.1 Create admin layout with sidebar navigation at /admin
- [ ] 9.2 Build admin dashboard with platform metrics (users, coaches, reviews by status, pending items)
- [ ] 9.3 Build PoS review queue page (list PENDING_ADMIN reviews with pre-signed photo URLs)
- [ ] 9.4 Implement admin approve/reject actions for PoS reviews
- [ ] 9.5 Build coach claim management page (list pending claims, approve/reject)
- [ ] 9.6 Build dispute management page (list DISPUTED reviews, resolve actions)
- [ ] 9.7 Build shadowban management page (view flagged accounts, apply/remove shadowban)

## 10. App Shell & Layout

- [ ] 10.1 Create app layout with header, navigation, and footer
- [ ] 10.2 Implement route groups: (public), (auth), admin
- [ ] 10.3 Create shared UI components (Button, Card, Input, Modal, Badge, Avatar)
- [ ] 10.4 Configure React Query provider for client-side data fetching
- [ ] 10.5 Create error boundary and loading skeleton components
- [ ] 10.6 Implement responsive design (mobile-first with Tailwind breakpoints)
