# DebateSpeak AI — Database Specification & Schema Architecture

**Document Version:** 1.0.0  
**Target RDBMS:** PostgreSQL 16+  
**Target Subsystems:** 10 Distinct Functional Groups (FG-1 to FG-10)  
**Lead Author:** Backend & Real-Time Media Lead (Nguyễn Hồng Tấn Tài)

---

## 1. Executive Architecture Summary

The DebateSpeak AI storage architecture is structured on PostgreSQL, utilizing strong relational integrity for transactional workflows (identities, session lifecycle states, speaker attribution) paired with semi-structured JSONB payloads for asynchronous AI outputs (CEFR multi-agent evaluation trees, quote-grounding items, audio metrics, and web fact-checking traces).

### Core Database Conventions
- **Primary Keys:** UUIDv4 generated via `gen_random_uuid()` to prevent ID enumeration across public endpoints.
- **Timestamps:** Timezone-aware UTC timestamps (`TIMESTAMPTZ`) using server-level `CURRENT_TIMESTAMP`.
- **Naming Convention:** `snake_case` for all table names, column attributes, foreign keys, and indexes.
- **Delete Policy:** Explicit `ON DELETE CASCADE` on tightly coupled dependent records (e.g., room-associated transcripts and evaluation reports) and `ON DELETE RESTRICT` on shared assets (e.g., curated debate topics).

---

## 2. Entity-Relationship (ER) Overview

```
                      +-------------------+
                      |       users       |
                      +---------+---------+
                                | 1
                                |
         +----------------------+----------------------+
         | N                    | N                    | N
+--------+--------+    +--------+--------+    +--------+--------+
| refresh_tokens  |    | debate_members  |    | personalized_   |
+-----------------+    +--------+--------+    | drills          |
                                | N           +-----------------+
                                | 1
                       +--------+--------+
         +------------>|  debate_rooms   |<------------+
         |             +--------+--------+             |
         | 1                    | 1                    | 1
+--------+--------+             |             +--------+--------+
|  debate_topics  |             +------------>| debate_reports  |
+-----------------+             | N           +--------+--------+
                       +--------+--------+             | 1
                       |   transcripts   |             | N
                       +--------+--------+    +--------+--------+
                                | 1           | fact_check_     |
                                | N           | results         |
                       +--------+--------+    +-----------------+
                       |   transcript_   |
                       |   feedbacks     |
                       +-----------------+
```

---

## 3. Schema Definitions Mapped to 10 Functional Groups

### 3.1. FG-1: User Account & Profile Management

Manages user identity, Argon2id credentials, target CEFR proficiencies, and cryptographic refresh token rotation.

#### Table: `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique user identifier |
| `email` | `VARCHAR(255)` | `NOT NULL UNIQUE` | Account email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Argon2id salted hash digest |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Display name of the debater/admin |
| `target_cefr` | `VARCHAR(2)` | `NOT NULL DEFAULT 'B1'` | Target level: `A2`, `B1`, `B2`, `C1` |
| `role` | `VARCHAR(20)` | `NOT NULL DEFAULT 'debater'` | System role: `debater`, `moderator`, `admin` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Account registration time |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Profile modification time |

#### Table: `refresh_tokens`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Refresh session record identifier |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Owner user ID |
| `token_hash` | `VARCHAR(64)` | `NOT NULL UNIQUE` | SHA-256 hash of the issued refresh token |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | Absolute token expiry boundary |
| `revoked` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Invalidation flag for token rotation |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Issuance timestamp |

---

### 3.2. FG-2: Debate Topic & Difficulty Management

Catalog of curated debate motions with pedagogical metadata and lexicon recommendations.

#### Table: `debate_topics`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique topic identifier |
| `title` | `VARCHAR(255)` | `NOT NULL` | Human-readable debate motion title |
| `motion` | `TEXT` | `NOT NULL` | Official motion statement ("This House Would...") |
| `category` | `VARCHAR(50)` | `NOT NULL` | Category: `Technology`, `Ethics`, `Economy`, etc. |
| `difficulty_cefr` | `VARCHAR(2)` | `NOT NULL` | Recommended baseline CEFR: `A2`, `B1`, `B2`, `C1` |
| `suggested_vocabulary`| `JSONB` | `NOT NULL DEFAULT '[]'` | Curated keywords, collocations, phrases |
| `is_active` | `BOOLEAN` | `NOT NULL DEFAULT TRUE` | Active visibility in the lobby catalog |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 3.3. FG-3 & FG-4: Debate Room, Live Session & Audio RTC

Finite state machine session management (`LOBBY` $\to$ `READY` $\to$ `LIVE` $\to$ `ENDED`), participant readiness gates, and LiveKit audio room tracking.

#### Table: `debate_rooms`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Room identifier |
| `topic_id` | `UUID` | `NOT NULL REFERENCES debate_topics(id) ON DELETE RESTRICT` | Assigned debate motion |
| `livekit_room_name`| `VARCHAR(100)` | `NOT NULL UNIQUE` | LiveKit WebRTC room identifier |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'LOBBY'` | Enum: `LOBBY`, `READY`, `LIVE`, `ENDED` |
| `turn_seconds` | `INTEGER` | `NOT NULL DEFAULT 180` | Max allocated speaking time per turn |
| `started_at` | `TIMESTAMPTZ` | `NULL` | Transition time to `LIVE` |
| `ended_at` | `TIMESTAMPTZ` | `NULL` | Transition time to `ENDED` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Room initial creation |

#### Table: `debate_members`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Membership association ID |
| `room_id` | `UUID` | `NOT NULL REFERENCES debate_rooms(id) ON DELETE CASCADE` | Associated room |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Participating user |
| `role` | `VARCHAR(20)` | `NOT NULL` | Enum: `PROPOSITION`, `OPPOSITION` |
| `has_consented` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Dual-consent readiness gate flag |
| `joined_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Join timestamp |

---

### 3.4. FG-5: Speech-to-Text & Speaker Attribution

Deterministic audio track transcripts segmented with Silero VAD and precise timing offsets.

#### Table: `transcripts`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Transcript segment identifier |
| `room_id` | `UUID` | `NOT NULL REFERENCES debate_rooms(id) ON DELETE CASCADE` | Associated debate room |
| `speaker_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE RESTRICT` | Attributed debater |
| `audio_track_id` | `VARCHAR(100)` | `NOT NULL` | LiveKit track SID |
| `start_offset_ms` | `INTEGER` | `NOT NULL` | Utterance start offset in ms |
| `end_offset_ms` | `INTEGER` | `NOT NULL` | Utterance end offset in ms |
| `text` | `TEXT` | `NOT NULL` | Transcribed speech content |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Insertion timestamp |

---

### 3.5. FG-6, FG-7, FG-9, FG-10: Multi-Agent Evaluation & Learning Reports

Synthesized multi-dimensional evaluation results, language fluency metrics, argument flow, consensus judge scoring, and strict quote-grounded feedback.

#### Table: `debate_reports`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Report identifier |
| `room_id` | `UUID` | `NOT NULL UNIQUE REFERENCES debate_rooms(id) ON DELETE CASCADE` | Associated debate room |
| `status` | `VARCHAR(20)` | `NOT NULL DEFAULT 'PENDING'` | Enum: `PENDING`, `COMPLETED`, `FAILED` |
| `spoken_metrics` | `JSONB` | `NOT NULL DEFAULT '{}'` | WPM, pause profiles, filler rates per speaker |
| `argument_analysis`| `JSONB` | `NOT NULL DEFAULT '{}'` | Claims, rebuttals, concessions, fallacies |
| `evaluator_scores` | `JSONB` | `NOT NULL DEFAULT '{}'` | CEFR linguistic scores and judge consensus |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Report initialization timestamp |

#### Table: `transcript_feedbacks`
*Enforces the Strict Quote-Grounding Rule: every coaching feedback item references verbatim learner utterances.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Feedback item ID |
| `report_id` | `UUID` | `NOT NULL REFERENCES debate_reports(id) ON DELETE CASCADE` | Parent evaluation report |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Learner receiving feedback |
| `verbatim_quote` | `TEXT` | `NOT NULL` | Exact verbatim substring from transcript |
| `category` | `VARCHAR(50)` | `NOT NULL` | Category: `GRAMMAR`, `LEXICAL`, `LOGIC` |
| `suggestion` | `TEXT` | `NOT NULL` | Pedagogical advice and correction |
| `cefr_level` | `VARCHAR(2)` | `NOT NULL` | Target difficulty ceiling: `A2` to `C1` |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Record timestamp |

#### Table: `personalized_drills`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Drill exercise ID |
| `user_id` | `UUID` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | Recipient learner |
| `report_id` | `UUID` | `NOT NULL REFERENCES debate_reports(id) ON DELETE CASCADE` | Originating debate report |
| `drill_type` | `VARCHAR(50)` | `NOT NULL` | Type: `FILL_BLANK`, `REBUTTAL_PROMPT` |
| `content` | `JSONB` | `NOT NULL` | Interactive prompt and evaluation rubric |
| `is_completed` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Completion status |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Record timestamp |

---

### 3.6. FG-8: AI Fact-Checking & Evidence Analysis

Verifiable factual assertions cross-referenced against search retrieval sources with 5-level confidence verdicts.

#### Table: `fact_check_results`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Fact check entry ID |
| `report_id` | `UUID` | `NOT NULL REFERENCES debate_reports(id) ON DELETE CASCADE` | Parent evaluation report |
| `claim` | `TEXT` | `NOT NULL` | Extracted factual claim statement |
| `verdict` | `VARCHAR(30)` | `NOT NULL` | Verdict: `TRUE`, `MOSTLY_TRUE`, `HALF_TRUE`, `MOSTLY_FALSE`, `FALSE` |
| `confidence_score`| `NUMERIC(3, 2)`| `NOT NULL` | Probability metric ($0.00 \le x \le 1.00$) |
| `sources` | `JSONB` | `NOT NULL DEFAULT '[]'` | List of reference objects (`url`, `title`, `snippet`) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | Verification timestamp |

---

## 4. Performance Indexes & Relational Constraints

```sql
-- FG-1: Fast credential and token lookup
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash) WHERE revoked IS FALSE;

-- FG-3 & FG-4: Room lookup and participant pairing
CREATE INDEX idx_debate_rooms_status ON debate_rooms(status);
CREATE UNIQUE INDEX uq_room_member ON debate_members(room_id, user_id);
CREATE UNIQUE INDEX uq_room_role ON debate_members(room_id, role);

-- FG-5: Time-ordered speaker transcripts query
CREATE INDEX idx_transcripts_room_speaker_offset 
    ON transcripts(room_id, speaker_id, start_offset_ms ASC);

-- FG-8, FG-10: Report drill and feedback retrieval
CREATE INDEX idx_transcript_feedbacks_user ON transcript_feedbacks(user_id);
CREATE INDEX idx_personalized_drills_user_status ON personalized_drills(user_id, is_completed);
CREATE INDEX idx_fact_check_report ON fact_check_results(report_id);
```

---

## 5. PostgreSQL DDL Migration Script

```sql
-- Extension initialization
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- FG-1: Accounts & Security
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    target_cefr VARCHAR(2) NOT NULL DEFAULT 'B1' CHECK (target_cefr IN ('A2', 'B1', 'B2', 'C1')),
    role VARCHAR(20) NOT NULL DEFAULT 'debater' CHECK (role IN ('debater', 'moderator', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FG-2: Topics
CREATE TABLE debate_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    motion TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    difficulty_cefr VARCHAR(2) NOT NULL CHECK (difficulty_cefr IN ('A2', 'B1', 'B2', 'C1')),
    suggested_vocabulary JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FG-3 & FG-4: Rooms & Members
CREATE TABLE debate_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES debate_topics(id) ON DELETE RESTRICT,
    livekit_room_name VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'LOBBY' CHECK (status IN ('LOBBY', 'READY', 'LIVE', 'ENDED')),
    turn_seconds INTEGER NOT NULL DEFAULT 180,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE debate_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES debate_rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('PROPOSITION', 'OPPOSITION')),
    has_consented BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_debate_room_user UNIQUE (room_id, user_id),
    CONSTRAINT uq_debate_room_role UNIQUE (room_id, role)
);

-- FG-5: Transcripts
CREATE TABLE transcripts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES debate_rooms(id) ON DELETE CASCADE,
    speaker_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    audio_track_id VARCHAR(100) NOT NULL,
    start_offset_ms INTEGER NOT NULL,
    end_offset_ms INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FG-6, FG-7, FG-9, FG-10: Reports & Drills
CREATE TABLE debate_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL UNIQUE REFERENCES debate_rooms(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    spoken_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    argument_analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
    evaluator_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transcript_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES debate_reports(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    verbatim_quote TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('GRAMMAR', 'LEXICAL', 'LOGIC')),
    suggestion TEXT NOT NULL,
    cefr_level VARCHAR(2) NOT NULL CHECK (cefr_level IN ('A2', 'B1', 'B2', 'C1')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE personalized_drills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_id UUID NOT NULL REFERENCES debate_reports(id) ON DELETE CASCADE,
    drill_type VARCHAR(50) NOT NULL CHECK (drill_type IN ('FILL_BLANK', 'REBUTTAL_PROMPT', 'PRONUNCIATION')),
    content JSONB NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FG-8: Fact-Checking
CREATE TABLE fact_check_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES debate_reports(id) ON DELETE CASCADE,
    claim TEXT NOT NULL,
    verdict VARCHAR(30) NOT NULL CHECK (verdict IN ('TRUE', 'MOSTLY_TRUE', 'HALF_TRUE', 'MOSTLY_FALSE', 'FALSE')),
    confidence_score NUMERIC(3, 2) NOT NULL CHECK (confidence_score >= 0.00 AND confidence_score <= 1.00),
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash) WHERE revoked IS FALSE;
CREATE INDEX idx_debate_rooms_status ON debate_rooms(status);
CREATE INDEX idx_transcripts_room_speaker_offset ON transcripts(room_id, speaker_id, start_offset_ms ASC);
CREATE INDEX idx_transcript_feedbacks_user ON transcript_feedbacks(user_id);
CREATE INDEX idx_personalized_drills_user_status ON personalized_drills(user_id, is_completed);
CREATE INDEX idx_fact_check_report ON fact_check_results(report_id);
```