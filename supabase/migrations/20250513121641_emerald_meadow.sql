/*
  # Create high scores table

  1. New Tables
    - `highscores`
      - `id` (uuid, primary key)
      - `user_email` (text, stores player name)
      - `score` (integer)
      - `wave` (integer)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `highscores` table
    - Add policy for public read access
    - Add policy for public insert access
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

-- Policies
CREATE POLICY "Anyone can view high scores"
  ON highscores
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert scores"
  ON highscores
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS highscores_score_idx ON highscores (score DESC);