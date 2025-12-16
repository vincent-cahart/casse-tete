"use client"

import { PuzzleGrid } from "./puzzle-grid"

export function PuzzleVisual() {
  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <PuzzleGrid values={Array(9).fill("?")} className="max-w-4xl mx-auto" />
    </div>
  )
}
