-- Create table to store puzzle solutions
CREATE TABLE IF NOT EXISTS puzzle_solutions (
  id SERIAL PRIMARY KEY,
  solution JSONB NOT NULL,
  equation TEXT NOT NULL,
  result INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'correct' CHECK (status IN ('correct', 'incorrect')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
