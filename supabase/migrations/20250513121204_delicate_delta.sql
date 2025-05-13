/*
  # Create high scores table and policies

  1. New Tables
    - `highscores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `user_email` (text)
      - `score` (integer)
      - `wave` (integer) 
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `highscores` table
    - Add policies for:
      - Anyone can read high scores
      - Authenticated users can insert their own scores
      - Users can only update/delete their own scores
*/

-- Create high scores table
CREATE TABLE IF NOT EXISTS highscores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
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

CREATE POLICY "Users can insert their own scores"
  ON highscores
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    user_id = auth.uid()
  );

CREATE POLICY "Users can update their own scores"
  ON highscores
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own scores"
  ON highscores
  FOR DELETE
  USING (user_id = auth.uid());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS highscores_score_idx ON highscores (score DESC);