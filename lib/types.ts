export type SolutionStatus = "correct" | "incorrect"

export interface Solution {
  id: number
  solution: number[]
  equation: string
  result: number
  status: SolutionStatus
  created_at: string
}
