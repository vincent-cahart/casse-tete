"use client"

import { AlertTriangle, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PuzzleGrid } from "./puzzle-grid"
import type { Solution } from "@/lib/types"

interface SolutionGridProps {
  solutions: Solution[]
  onEdit: (solution: Solution) => void
  onDelete: (id: number) => void
}

export function SolutionGrid({ solutions, onEdit, onDelete }: SolutionGridProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution, index) => (
          <div
            key={solution.id}
            className={`rounded-lg border p-4 bg-white shadow-sm transition-shadow hover:shadow-md ${
              solution.status === "incorrect" ? "border-red-300 bg-red-50" : ""
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="font-mono text-xs px-2 py-1 rounded border">#{solution.id}</span>
                <span
                  className={`text-xs px-2 py-1 rounded uppercase tracking-wide ${
                    solution.status === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                  }`}
                >
                  {solution.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 border space-y-2">
                <div className="text-center text-xs uppercase tracking-wide text-gray-500">Disposition</div>

                {solution.solution.length === 9 && (
                  <PuzzleGrid values={solution.solution} className="max-w-[560px] mx-auto" />
                )}

                <div
                  className={`text-sm font-semibold text-center flex items-center justify-center gap-2 ${
                    solution.status === "correct" ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {solution.status !== "correct" && <AlertTriangle className="size-4" />}
                  <span>Résultat : {solution.result}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" variant="outline" onClick={() => onEdit(solution)}>
                  <Edit className="size-4" />
                  Modifier
                </Button>
                <Button variant="destructive" onClick={() => onDelete(solution.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
