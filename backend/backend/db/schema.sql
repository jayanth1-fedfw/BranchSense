-- BranchSense Database Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  board VARCHAR(50) NOT NULL,        -- CBSE / AP / TS / MH etc.
  year_passed INT NOT NULL,
  stream VARCHAR(20) NOT NULL,       -- MPC / BiPC / MEC
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS topic_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  subject VARCHAR(20) NOT NULL,      -- MATHS / PHYSICS / CHEMISTRY
  topic_name VARCHAR(100) NOT NULL,
  marks_obtained NUMERIC NOT NULL,
  max_marks NUMERIC NOT NULL,
  percentage NUMERIC GENERATED ALWAYS AS (
    CASE WHEN max_marks > 0 THEN (marks_obtained / max_marks) * 100 ELSE 0 END
  ) STORED,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS branch_topic_weights (
  id SERIAL PRIMARY KEY,
  branch VARCHAR(50) NOT NULL,       -- CSE / ECE / EEE / MECH / CIVIL / AI_ML / CHEMICAL / BIOTECH etc.
  topic_name VARCHAR(100) NOT NULL,
  weight NUMERIC NOT NULL CHECK (weight >= 0 AND weight <= 1),
  UNIQUE (branch, topic_name)
);

CREATE TABLE IF NOT EXISTS aptitude_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  question_id VARCHAR(50) NOT NULL,
  answer VARCHAR(100) NOT NULL,
  branch_boost VARCHAR(50),          -- branch this answer nudges toward, if any
  boost_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  branch_1 VARCHAR(50),
  branch_1_score NUMERIC,
  branch_2 VARCHAR(50),
  branch_2_score NUMERIC,
  branch_3 VARCHAR(50),
  branch_3_score NUMERIC,
  full_scores JSONB,                 -- all branch scores, not just top 3
  ai_explanation TEXT,
  generated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_topic_scores_student ON topic_scores(student_id);
CREATE INDEX IF NOT EXISTS idx_weights_branch ON branch_topic_weights(branch);
CREATE INDEX IF NOT EXISTS idx_recommendations_student ON recommendations(student_id);
