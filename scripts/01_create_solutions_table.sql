-- Create table to store puzzle solutions
CREATE TABLE IF NOT EXISTS puzzle_solutions (
  id SERIAL PRIMARY KEY,
  solution JSONB NOT NULL,
  equation TEXT NOT NULL,
  result INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_puzzle_result ON puzzle_solutions(result);
