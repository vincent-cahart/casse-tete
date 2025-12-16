-- Add status column to track if solution is correct or incorrect
ALTER TABLE puzzle_solutions
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'correct' CHECK (status IN ('correct', 'incorrect'));

-- Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_puzzle_status ON puzzle_solutions(status);

-- Add index for equation search
CREATE INDEX IF NOT EXISTS idx_puzzle_equation ON puzzle_solutions USING gin(to_tsvector('simple', equation));
