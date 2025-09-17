# Ideabrowser Database Schema Documentation

## Overview

The Ideabrowser Rails application uses a modern database architecture built on Rails 8.0 with SQLite3 as the primary database. The schema follows Rails conventions and includes several specialized table groups for different application concerns.

### Database Architecture

The application employs a multi-schema approach with separate database files for different concerns:

- **Main Database**: Application-specific tables (users, core business logic)
- **Solid Cache**: High-performance caching layer replacing Redis
- **Solid Queue**: Background job processing system replacing Sidekiq/Resque
- **Solid Cable**: WebSocket connection management for ActionCable

This architecture provides a simpler deployment model while maintaining the performance and scalability benefits of traditional Redis-based setups.

## Application Tables

### users

**Purpose**: Core user authentication and account management table for the Ideabrowser platform.

**Business Context**: Handles user registration, authentication, email verification, password reset functionality, and subscription management for the idea browsing platform.

```sql
CREATE TABLE "users" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "email" varchar NOT NULL,
  "password_digest" varchar NOT NULL,
  "email_verified" boolean DEFAULT 0 NOT NULL,
  "email_verification_token" varchar,
  "email_verification_sent_at" datetime,
  "email_verified_at" datetime,
  "password_reset_token" varchar,
  "password_reset_sent_at" datetime,
  "active" boolean DEFAULT 1 NOT NULL,
  "last_login_at" datetime,
  "last_login_ip" varchar,
  "subscription_plan" varchar,
  "subscription_expires_at" datetime,
  "trial_used" boolean DEFAULT 0,
  "failed_login_attempts" integer DEFAULT 0,
  "locked_until" datetime,
  "created_at" datetime NOT NULL,
  "updated_at" datetime NOT NULL
);
```

#### Column Definitions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY | Auto-incrementing unique identifier |
| `email` | STRING | NOT NULL, UNIQUE | User's email address (also serves as username) |
| `password_digest` | STRING | NOT NULL | Bcrypt-encrypted password hash |
| `email_verified` | BOOLEAN | NOT NULL, DEFAULT false | Whether user has verified their email |
| `email_verification_token` | STRING | UNIQUE | Secure token for email verification |
| `email_verification_sent_at` | DATETIME | | Timestamp when verification email was sent |
| `email_verified_at` | DATETIME | | Timestamp when email was successfully verified |
| `password_reset_token` | STRING | UNIQUE | Secure token for password reset |
| `password_reset_sent_at` | DATETIME | | Timestamp when password reset email was sent |
| `active` | BOOLEAN | NOT NULL, DEFAULT true | Whether the account is active (soft delete) |
| `last_login_at` | DATETIME | | Timestamp of user's last successful login |
| `last_login_ip` | STRING | | IP address of user's last login (for security) |
| `subscription_plan` | STRING | | Current subscription tier: 'trial', 'starter', 'pro' |
| `subscription_expires_at` | DATETIME | | When current subscription expires |
| `trial_used` | BOOLEAN | DEFAULT false | Whether user has used their trial period |
| `failed_login_attempts` | INTEGER | DEFAULT 0 | Counter for failed login attempts |
| `locked_until` | DATETIME | | Account lock expiration (after failed attempts) |
| `created_at` | DATETIME | NOT NULL | Record creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Record last update timestamp |

#### Indexes

```sql
-- Performance and uniqueness indexes
CREATE UNIQUE INDEX "index_users_on_email" ON "users" ("email");
CREATE UNIQUE INDEX "index_users_on_email_verification_token" ON "users" ("email_verification_token");
CREATE UNIQUE INDEX "index_users_on_password_reset_token" ON "users" ("password_reset_token");

-- Query optimization indexes
CREATE INDEX "index_users_on_subscription_plan" ON "users" ("subscription_plan");
CREATE INDEX "index_users_on_active_and_email_verified" ON "users" ("active", "email_verified");
```

#### Business Logic Constraints

**Email Validation**:
- Must be present and unique (case-insensitive)
- Must match valid email format using URI::MailTo::EMAIL_REGEXP

**Password Security**:
- Minimum 8 characters
- Stored using bcrypt encryption via `has_secure_password`
- Password confirmation required on creation/update

**Subscription Management**:
- Valid plans: 'trial', 'starter', 'pro'
- Trial can only be used once per user
- Subscription expiration tracking for billing

**Security Features**:
- Account locking after 5 failed login attempts (1 hour duration)
- Email verification required for account activation
- Secure token generation for email verification and password reset
- Token expiration (24 hours for email verification, 2 hours for password reset)

#### User Model Scopes

```ruby
scope :verified, -> { where(email_verified: true) }
scope :active, -> { where(active: true) }
scope :with_subscription, -> { where.not(subscription_plan: nil) }
```

## Solid Cache Tables

**Purpose**: High-performance caching system replacing Redis for Rails caching.

### solid_cache_entries

```sql
CREATE TABLE "solid_cache_entries" (
  "key" blob(1024) NOT NULL,
  "value" blob(536870912) NOT NULL,
  "created_at" datetime NOT NULL,
  "key_hash" integer(8) NOT NULL,
  "byte_size" integer(4) NOT NULL
);

-- Indexes for performance
CREATE UNIQUE INDEX "index_solid_cache_entries_on_key_hash" ON "solid_cache_entries" ("key_hash");
CREATE INDEX "index_solid_cache_entries_on_key_hash_and_byte_size" ON "solid_cache_entries" ("key_hash", "byte_size");
CREATE INDEX "index_solid_cache_entries_on_byte_size" ON "solid_cache_entries" ("byte_size");
```

**Business Context**: Stores cached data for improved application performance, including database query results, rendered fragments, and computed values.

## Solid Queue Tables

**Purpose**: Background job processing system replacing Sidekiq/Resque.

### Core Job Tables

#### solid_queue_jobs
```sql
CREATE TABLE "solid_queue_jobs" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "queue_name" varchar NOT NULL,
  "class_name" varchar NOT NULL,
  "arguments" text,
  "priority" integer DEFAULT 0 NOT NULL,
  "active_job_id" varchar,
  "scheduled_at" datetime,
  "finished_at" datetime,
  "concurrency_key" varchar,
  "created_at" datetime NOT NULL,
  "updated_at" datetime NOT NULL
);
```

#### solid_queue_ready_executions
Ready-to-run jobs waiting for worker pickup.

#### solid_queue_claimed_executions
Jobs currently being processed by workers.

#### solid_queue_failed_executions
Failed job executions with error information.

#### solid_queue_scheduled_executions
Jobs scheduled for future execution.

#### solid_queue_blocked_executions
Jobs blocked due to concurrency limits.

### Process Management Tables

#### solid_queue_processes
Worker process tracking and heartbeat monitoring.

#### solid_queue_pauses
Queue pause/resume state management.

#### solid_queue_semaphores
Concurrency control and resource limiting.

### Recurring Job Tables

#### solid_queue_recurring_tasks
Cron-like recurring job definitions.

#### solid_queue_recurring_executions
Tracking of recurring job executions.

**Business Context**: Handles background tasks like email sending, data processing, subscription renewals, and scheduled maintenance tasks.

## Solid Cable Tables

**Purpose**: WebSocket connection management for real-time features.

### solid_cable_messages

```sql
CREATE TABLE "solid_cable_messages" (
  "channel" blob(1024) NOT NULL,
  "payload" blob(536870912) NOT NULL,
  "created_at" datetime NOT NULL,
  "channel_hash" integer(8) NOT NULL
);
```

**Business Context**: Manages real-time communication channels for features like live notifications, chat, or collaborative editing.

## Database Relationships

### Current Schema Relationships

```
Users Table (Standalone)
├── No foreign key relationships yet
├── Self-contained authentication system
└── Ready for future expansion

Solid Queue Tables (Interconnected)
├── solid_queue_jobs (central table)
│   ├── → solid_queue_ready_executions (FK: job_id)
│   ├── → solid_queue_claimed_executions (FK: job_id)
│   ├── → solid_queue_failed_executions (FK: job_id)
│   ├── → solid_queue_scheduled_executions (FK: job_id)
│   ├── → solid_queue_blocked_executions (FK: job_id)
│   └── → solid_queue_recurring_executions (FK: job_id)
├── solid_queue_processes (worker management)
├── solid_queue_pauses (queue control)
├── solid_queue_semaphores (concurrency control)
└── solid_queue_recurring_tasks (job definitions)

Solid Cache Tables (Standalone)
└── solid_cache_entries (key-value storage)

Solid Cable Tables (Standalone)
└── solid_cable_messages (WebSocket messages)
```

### ASCII Relationship Diagram

```
┌─────────────────┐
│ Users           │
│ - id (PK)       │
│ - email         │
│ - password_*    │
│ - subscription* │
│ - security*     │
└─────────────────┘
        │
        │ (Future relationships)
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ [Future Tables] │    │ Solid Cache     │    │ Solid Cable     │
│ Ideas           │    │ - entries       │    │ - messages      │
│ Bookmarks       │    │                 │    │                 │
│ Collections     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Solid Queue System                                              │
│                                                                 │
│  ┌─────────────┐    ┌──────────────────┐    ┌─────────────────┐ │
│  │ Jobs (PK)   │◄───│ Ready Executions │    │ Processes       │ │
│  │ - queue     │    │ - job_id (FK)    │    │ - supervisor    │ │
│  │ - class     │    │ - priority       │    │ - heartbeat     │ │
│  │ - args      │    └──────────────────┘    └─────────────────┘ │
│  └─────────────┘                                                │
│         │                                                       │
│         ├── Claimed Executions                                  │
│         ├── Failed Executions                                   │
│         ├── Scheduled Executions                                │
│         ├── Blocked Executions                                  │
│         └── Recurring Executions                                │
└─────────────────────────────────────────────────────────────────┘
```

## Security Considerations

### Data Protection

1. **Password Security**:
   - Bcrypt encryption with cost factor (Rails default: 12)
   - No plaintext password storage
   - Secure password reset mechanism

2. **Token Security**:
   - Cryptographically secure random tokens (32-byte URL-safe Base64)
   - Time-based token expiration
   - Unique constraints prevent token reuse

3. **Account Security**:
   - Failed login attempt tracking
   - Automatic account locking mechanism
   - IP address logging for forensics

4. **Email Security**:
   - Email verification requirement
   - Case-insensitive unique constraint
   - Format validation

### Performance Optimizations

1. **Strategic Indexing**:
   - Unique indexes on email and tokens for fast lookups
   - Composite indexes for common query patterns
   - Subscription plan indexing for billing queries

2. **Solid Cache Performance**:
   - Hash-based key lookup for O(1) access
   - Byte size indexing for memory management
   - Binary storage for efficiency

3. **Solid Queue Performance**:
   - Priority-based job indexing
   - Queue-specific indexes for worker efficiency
   - Process heartbeat monitoring

## Future Schema Considerations

Based on the Ideabrowser application context, likely future table additions:

### Planned Extensions

```sql
-- Ideas/Content Management
CREATE TABLE "ideas" (
  "id" INTEGER PRIMARY KEY,
  "user_id" INTEGER REFERENCES users(id),
  "title" varchar NOT NULL,
  "description" text,
  "category" varchar,
  "tags" json,
  "created_at" datetime NOT NULL,
  "updated_at" datetime NOT NULL
);

-- User Bookmarks/Favorites
CREATE TABLE "bookmarks" (
  "id" INTEGER PRIMARY KEY,
  "user_id" INTEGER REFERENCES users(id),
  "idea_id" INTEGER REFERENCES ideas(id),
  "created_at" datetime NOT NULL
);

-- Collections/Lists
CREATE TABLE "collections" (
  "id" INTEGER PRIMARY KEY,
  "user_id" INTEGER REFERENCES users(id),
  "name" varchar NOT NULL,
  "description" text,
  "public" boolean DEFAULT false,
  "created_at" datetime NOT NULL,
  "updated_at" datetime NOT NULL
);
```

## Migration History

### Current Version: 20250916113010

1. **Initial User System** (20250916113010_create_users.rb):
   - Complete authentication system
   - Email verification workflow
   - Password reset mechanism
   - Subscription management
   - Security features (account locking, failed attempts)

### Migration Strategy

The application follows Rails migration best practices:
- Atomic migrations with proper rollback support
- Index creation for performance
- Constraint addition for data integrity
- Timestamp tracking for all changes

## Conclusion

The Ideabrowser database schema represents a solid foundation for a modern Rails application with:

- **Security-first approach** with comprehensive authentication
- **Performance optimization** through strategic indexing
- **Scalability preparation** with Solid* gem integration
- **Modern Rails 8 patterns** and conventions
- **Extensibility** for future feature development

The schema is well-positioned for growth while maintaining simplicity and following Rails conventions.