/*
  # Enhanced Idea Tracking Schema

  1. New Tables
    - `idea_versions`: Track version history of ideas
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `title` (text)
      - `description` (text)
      - `changes` (jsonb)
      - `created_at` (timestamp)
      - `created_by` (uuid, references auth.users)

    - `idea_comments`: Store stakeholder feedback
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamp)

    - `idea_attachments`: Store supporting documents
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `name` (text)
      - `file_path` (text)
      - `file_type` (text)
      - `size` (integer)
      - `uploaded_by` (uuid, references auth.users)
      - `uploaded_at` (timestamp)

  2. Modifications
    - Add new columns to ideas table
    - Add RLS policies for new tables
*/

-- Modify ideas table with new columns
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS priority text CHECK (priority IN ('low', 'medium', 'high'));
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS expected_impact text;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS required_resources text;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS timeline jsonb;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS last_status_change timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Create idea_versions table
CREATE TABLE IF NOT EXISTS idea_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  changes jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create idea_comments table
CREATE TABLE IF NOT EXISTS idea_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create idea_attachments table
CREATE TABLE IF NOT EXISTS idea_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  size integer NOT NULL,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  uploaded_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE idea_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for idea_versions
CREATE POLICY "Users can view versions of ideas they have access to"
  ON idea_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = idea_versions.idea_id
  ));

CREATE POLICY "Users can create versions of their own ideas"
  ON idea_versions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = idea_versions.idea_id AND ideas.user_id = auth.uid()
  ));

-- RLS Policies for idea_comments
CREATE POLICY "Users can view comments on ideas they have access to"
  ON idea_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = idea_comments.idea_id
  ));

CREATE POLICY "Users can create comments on any idea"
  ON idea_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON idea_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON idea_comments FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for idea_attachments
CREATE POLICY "Users can view attachments of ideas they have access to"
  ON idea_attachments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = idea_attachments.idea_id
  ));

CREATE POLICY "Users can upload attachments to their own ideas"
  ON idea_attachments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = idea_attachments.idea_id AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete attachments from their own ideas"
  ON idea_attachments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM ideas WHERE ideas.id = idea_attachments.idea_id AND ideas.user_id = auth.uid()
  ));

-- Create function to track idea status changes
CREATE OR REPLACE FUNCTION update_idea_last_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.last_status_change = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status change tracking
CREATE TRIGGER idea_status_change
  BEFORE UPDATE ON ideas
  FOR EACH ROW
  EXECUTE FUNCTION update_idea_last_status_change();