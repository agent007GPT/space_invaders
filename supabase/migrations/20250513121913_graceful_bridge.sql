/*
  # Update highscores table schema

  1. Table Structure
    - `highscores` table with:
      - `id` (uuid, primary key)
      - `user_email` (text)
      - `score` (integer)
      - `wave` (integer)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS
    - Add policies for viewing and inserting scores
    
  3. Performance
    - Add index on score for faster querying
*/

CREATE TABLE IF NOT EXISTS highscores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  score integer NOT NULL,
  wave integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE highscores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can view high scores" ON highscores;
  DROP POLICY IF EXISTS "Anyone can insert scores" ON highscores;
END $$;

-- Create policies
CREATE POLICY "Anyone can view high scores"
  ON highscores
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scores"
  ON highscores
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
DROP INDEX IF EXISTS highscores_score_idx;
CREATE INDEX highscores_score_idx ON highscores (score DESC);