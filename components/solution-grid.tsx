"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Edit, Trash2 } from "lucide-react"
import type { Solution } from "@/lib/types"

interface SolutionGridProps {
  solutions: Solution[]
  onEdit: (solution: Solution) => void
  onDelete: (id: number) => void
}

export function SolutionGrid({ solutions, onEdit, onDelete }: SolutionGridProps) {
  const renderSlot = (value: number) => (
    <span className="inline-flex items-center justify-center size-8 rounded bg-primary/10 text-primary font-semibold border border-primary/30">
      {value}
    </span>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((solution, index) => (
          <Card
            key={solution.id}
            className={`hover:shadow-lg transition-shadow ${
              solution.status === "incorrect" ? "border-destructive/50 bg-destructive/5" : ""
            }`}
          >
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono">
                    #{solution.id}
                  </Badge>
                  <Badge
                    variant={solution.status === "correct" ? "default" : "destructive"}
                    className="text-xs capitalize"
                  >
                    {solution.status}
                  </Badge>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 border border-border/50 space-y-2">
                  <div className="text-center text-xs uppercase tracking-wide text-muted-foreground">Disposition</div>

                  {solution.solution.length === 9 && (
                    <div className="space-y-1 font-mono text-sm text-center leading-relaxed">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {renderSlot(solution.solution[0])}
                        <span>+</span>
                        <span>13×</span>
                        {renderSlot(solution.solution[1])}
                        <span>÷</span>
                        {renderSlot(solution.solution[2])}
                        <span>+</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {renderSlot(solution.solution[3])}
                        <span>+</span>
                        <span>12×</span>
                        {renderSlot(solution.solution[4])}
                        <span>−</span>
                        {renderSlot(solution.solution[5])}
                        <span>−</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span>11 +</span>
                        {renderSlot(solution.solution[6])}
                        <span>×</span>
                        {renderSlot(solution.solution[7])}
                        <span>÷</span>
                        {renderSlot(solution.solution[8])}
                        <span>−</span>
                        <span>10</span>
                      </div>
                      <div className="text-base font-bold text-primary pt-2">= 66</div>
                    </div>
                  )}

                  <div
                    className={`text-sm font-semibold text-center flex items-center justify-center gap-2 ${
                      solution.status === "correct" ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {solution.status !== "correct" && <AlertTriangle className="size-4" />}
                    <span>Résultat : {solution.result}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onEdit(solution)}
                  >
                    <Edit className="size-3 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onDelete(solution.id)}>
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
