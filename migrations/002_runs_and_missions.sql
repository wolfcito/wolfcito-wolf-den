-- =====================================================
-- Migration: 002_runs_and_missions.sql
-- Description: Runs and Missions gamification system
-- Created: 2026-01-08
-- Tables: runs, missions, user_mission_progress
-- =====================================================

-- =====================================================
-- TABLE: runs
-- Description: Time-bounded challenges/hackathons/competitions
-- A "run" contains multiple missions that users can complete
-- =====================================================

CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Visual
  icon VARCHAR(50),
  cover_image_url TEXT,

  -- Configuration
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  visibility VARCHAR(20) NOT NULL DEFAULT 'public'
    CHECK (visibility IN ('public', 'private', 'invite_only')),

  -- Dates
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,

  -- Relations
  creator_id UUID REFERENCES lab_users(id) ON DELETE SET NULL,
  lab_id UUID REFERENCES event_labs(id) ON DELETE SET NULL,

  -- Metadata (flexible JSONB for custom fields)
  metadata JSONB NOT NULL DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for runs
CREATE INDEX IF NOT EXISTS idx_runs_slug ON runs(slug);
CREATE INDEX IF NOT EXISTS idx_runs_creator_id ON runs(creator_id);
CREATE INDEX IF NOT EXISTS idx_runs_lab_id ON runs(lab_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_visibility ON runs(visibility);
CREATE INDEX IF NOT EXISTS idx_runs_start_date ON runs(start_date DESC);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_runs_status_visibility ON runs(status, visibility);

-- Updated_at trigger for runs
CREATE TRIGGER update_runs_updated_at
  BEFORE UPDATE ON runs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: missions
-- Description: Individual tasks/quests within a run
-- Users complete missions to earn points
-- =====================================================

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity
  slug VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,

  -- Visual
  icon VARCHAR(50),

  -- Reward
  points INT NOT NULL DEFAULT 0 CHECK (points >= 0),

  -- Requirements
  verification_type VARCHAR(30) NOT NULL DEFAULT 'manual'
    CHECK (verification_type IN ('manual', 'auto', 'proof_required', 'self_reported')),
  requirements JSONB NOT NULL DEFAULT '{}',

  -- Configuration
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('draft', 'active', 'locked', 'expired')),
  sort_order INT NOT NULL DEFAULT 0,

  -- Limits
  max_completions INT,

  -- Dependencies
  requires_mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,

  -- Relations
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,

  -- Metadata (flexible JSONB for custom fields)
  metadata JSONB NOT NULL DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Unique slug within a run
  CONSTRAINT missions_run_slug_unique UNIQUE (run_id, slug)
);

-- Indexes for missions
CREATE INDEX IF NOT EXISTS idx_missions_run_id ON missions(run_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_missions_sort_order ON missions(sort_order);
CREATE INDEX IF NOT EXISTS idx_missions_requires_mission_id ON missions(requires_mission_id);
CREATE INDEX IF NOT EXISTS idx_missions_created_at ON missions(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_missions_run_status ON missions(run_id, status);

-- Updated_at trigger for missions
CREATE TRIGGER update_missions_updated_at
  BEFORE UPDATE ON missions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: user_mission_progress
-- Description: Tracks user progress on missions
-- =====================================================

CREATE TABLE IF NOT EXISTS user_mission_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relations
  user_id UUID NOT NULL REFERENCES lab_users(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,

  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'started'
    CHECK (status IN ('started', 'submitted', 'approved', 'rejected')),

  -- Submission
  proof_url TEXT,
  proof_text TEXT,
  submission_metadata JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ,

  -- Review
  reviewed_by UUID REFERENCES lab_users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  -- Points (might differ from mission.points for bonuses/penalties)
  points_awarded INT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Each user can only have one progress record per mission
  CONSTRAINT user_mission_progress_unique UNIQUE (user_id, mission_id)
);

-- Indexes for user_mission_progress
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_user_id ON user_mission_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_mission_id ON user_mission_progress(mission_id);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_status ON user_mission_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_submitted_at ON user_mission_progress(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_reviewed_by ON user_mission_progress(reviewed_by);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_user_status ON user_mission_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_mission_progress_mission_status ON user_mission_progress(mission_id, status);

-- Updated_at trigger for user_mission_progress
CREATE TRIGGER update_user_mission_progress_updated_at
  BEFORE UPDATE ON user_mission_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEW: user_run_stats
-- Description: Aggregate stats for users within runs
-- =====================================================

CREATE OR REPLACE VIEW user_run_stats AS
SELECT
  r.id AS run_id,
  r.slug AS run_slug,
  r.name AS run_name,
  u.id AS user_id,
  u.handle AS user_handle,
  u.display_name,
  COUNT(DISTINCT ump.mission_id) FILTER (WHERE ump.status = 'approved') AS missions_completed,
  COUNT(DISTINCT m.id) AS total_missions,
  COALESCE(SUM(ump.points_awarded) FILTER (WHERE ump.status = 'approved'), 0) AS total_points,
  MAX(ump.updated_at) AS last_activity
FROM runs r
CROSS JOIN lab_users u
LEFT JOIN missions m ON m.run_id = r.id AND m.status = 'active'
LEFT JOIN user_mission_progress ump ON ump.mission_id = m.id AND ump.user_id = u.id
GROUP BY r.id, r.slug, r.name, u.id, u.handle, u.display_name;

-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================

COMMENT ON TABLE runs IS 'Time-bounded challenges/hackathons/competitions containing missions';
COMMENT ON COLUMN runs.slug IS 'URL-friendly identifier (unique)';
COMMENT ON COLUMN runs.status IS 'Run status: draft (not visible), active (open), paused, completed, archived';
COMMENT ON COLUMN runs.visibility IS 'Who can see: public (everyone), private (creator only), invite_only';
COMMENT ON COLUMN runs.lab_id IS 'Optional link to event_labs for run associated with specific lab';
COMMENT ON COLUMN runs.metadata IS 'Flexible JSONB for custom run configuration (e.g., rewards, rules)';

COMMENT ON TABLE missions IS 'Individual tasks/quests within a run that users complete for points';
COMMENT ON COLUMN missions.slug IS 'URL-friendly identifier (unique within run)';
COMMENT ON COLUMN missions.points IS 'Base points awarded for completing this mission';
COMMENT ON COLUMN missions.verification_type IS 'How completion is verified: manual (reviewer), auto (system), proof_required, self_reported';
COMMENT ON COLUMN missions.requirements IS 'JSONB defining what user must do (e.g., {"action": "submit_feedback", "count": 3})';
COMMENT ON COLUMN missions.status IS 'Mission status: draft, active (available), locked (requires dependency), expired';
COMMENT ON COLUMN missions.max_completions IS 'NULL for unlimited, or max number of users who can complete';
COMMENT ON COLUMN missions.requires_mission_id IS 'FK to another mission that must be completed first';

COMMENT ON TABLE user_mission_progress IS 'Tracks individual user progress on missions';
COMMENT ON COLUMN user_mission_progress.status IS 'Progress status: started (in progress), submitted (awaiting review), approved (complete), rejected';
COMMENT ON COLUMN user_mission_progress.proof_url IS 'Optional URL to proof (e.g., screenshot, link)';
COMMENT ON COLUMN user_mission_progress.proof_text IS 'Optional text description of completion';
COMMENT ON COLUMN user_mission_progress.points_awarded IS 'Actual points given (may include bonuses or differ from base)';

COMMENT ON VIEW user_run_stats IS 'Aggregated user statistics per run for leaderboards';

-- =====================================================
-- ROLLBACK
-- =====================================================

-- To rollback this migration, run:
-- DROP VIEW IF EXISTS user_run_stats CASCADE;
-- DROP TABLE IF EXISTS user_mission_progress CASCADE;
-- DROP TABLE IF EXISTS missions CASCADE;
-- DROP TABLE IF EXISTS runs CASCADE;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
