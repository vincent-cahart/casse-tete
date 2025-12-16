"use client"

import { useState, useEffect, useMemo } from "react"
import { Calculator, Clock, Database, Trash2, X } from "lucide-react"
import { SolutionGrid } from "./solution-grid"
import { PuzzleVisual } from "./puzzle-visual"
import { EditSolutionDialog } from "./edit-solution-dialog"
import { PuzzleGrid } from "./puzzle-grid"
import type { Solution } from "@/lib/types"
import { API_ENDPOINTS } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function PuzzleSolver() {
  type SortMode = "incorrect-first" | "correct-first" | "id-asc" | "id-desc"

  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [computationTime, setComputationTime] = useState<number | null>(null)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>("incorrect-first")
  const [positionFilters, setPositionFilters] = useState<Array<number | null>>(Array(9).fill(null))

  const notifyError = (message: string) => console.error(message)
  const notifySuccess = (message: string) => console.info(message)

  // Load solutions on mount
  useEffect(() => {
    loadSolutions()
  }, [])

  const loadSolutions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(API_ENDPOINTS.solutions)
      const data = await response.json()

      if (!response.ok) {
        notifyError(data.error || data.message || "Impossible de charger les solutions")
      } else {
        setSolutions(data.solutions || [])
      }
    } catch (error) {
      notifyError("Impossible de charger les solutions")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(API_ENDPOINTS.solutions, {
        method: "POST",
      })
      const data = await response.json()

      if (!response.ok) {
        notifyError(data.error || data.message || "Impossible de générer les solutions")
      } else {
        setComputationTime(data.computationTime)
        setSolutions(data.solutions)
        notifySuccess(`${data.count} solutions générées et enregistrées en ${data.computationTime.toFixed(2)}ms`)
      }
    } catch (error) {
      notifyError("Impossible de générer les solutions")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer toutes les solutions ?")) {
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.solutions, {
        method: "DELETE",
      })

      if (response.ok) {
        setSolutions([])
        notifySuccess("Toutes les solutions ont été supprimées")
      } else {
        const data = await response.json()
        notifyError(data.error || data.message || "Impossible de supprimer les solutions")
      }
    } catch (error) {
      notifyError("Impossible de supprimer les solutions")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette solution ?")) {
      return
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.solutions}/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSolutions((prev) => prev.filter((s) => s.id !== id))
        notifySuccess("Solution supprimée")
      } else {
        const data = await response.json()
        notifyError(data.error || data.message || "Impossible de supprimer la solution")
      }
    } catch (error) {
      notifyError("Impossible de supprimer la solution")
    }
  }

  const handleUpdate = (updatedSolution: Solution) => {
    setSolutions((prev) => prev.map((s) => (s.id === updatedSolution.id ? updatedSolution : s)))
    setSelectedSolution(null)
  }

  const handleSearch = () => {
    loadSolutions()
  }

  const handlePositionFilterChange = (index: number, value: string) => {
    setPositionFilters((prev) => {
      const next = [...prev]
      const num = Number(value)
      if (!value) {
        next[index] = null
      } else if (Number.isInteger(num) && num >= 1 && num <= 9) {
        next[index] = num
      }
      return next
    })
  }

  const clearPositionFilter = (index: number) => {
    setPositionFilters((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  const clearPositionFilters = () => setPositionFilters(Array(9).fill(null))

  const filteredSolutions = useMemo(() => {
    return solutions.filter((solution) =>
      positionFilters.every((value, idx) => value === null || solution.solution[idx] === value)
    )
  }, [solutions, positionFilters])

  const sortedSolutions = useMemo(() => {
    const arr = [...filteredSolutions]

    return arr.sort((a, b) => {
      switch (sortMode) {
        case "incorrect-first": {
          if (a.status !== b.status) return a.status === "incorrect" ? -1 : 1
          return a.id - b.id
        }
        case "correct-first": {
          if (a.status !== b.status) return a.status === "correct" ? -1 : 1
          return a.id - b.id
        }
        case "id-desc":
          return b.id - a.id
        case "id-asc":
        default:
          return a.id - b.id
      }
    })
  }, [filteredSolutions, sortMode])

  return (
    <div className="container mx-auto py-8 px-4 md:py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Le Puzzle Vietnamien</h1>
        <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
          Énigme mathématique virale de 2015 donnée à des élèves de CE2 au Vietnam
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5" />
            L'Énigme
          </CardTitle>
          <CardDescription>Placez les chiffres de 1 à 9 (chaque chiffre utilisé une seule fois) pour obtenir 66.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PuzzleVisual />

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button onClick={handleGenerate} disabled={isGenerating} className="w-full sm:w-auto" size="lg">
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⚙</span>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Database className="mr-2 size-4" />
                  Générer et Sauvegarder
                </>
              )}
            </Button>

            <Button
              onClick={handleDeleteAll}
              disabled={solutions.length === 0 || isGenerating}
              className="w-full sm:w-auto"
              size="lg"
              variant="destructive"
            >
              <Trash2 className="mr-2 size-4" />
              Tout Supprimer
            </Button>

            {computationTime !== null && (
              <span className="inline-flex items-center gap-2 rounded bg-gray-100 px-3 py-1 text-sm text-gray-700">
                <Clock className="size-3" /> Temps: {computationTime.toFixed(2)}ms
              </span>
            )}
          </div>

          {solutions.length > 0 && (
            <div className="pt-4 border-t space-y-4">
              <div className="flex-1">
                <div className="text-sm font-semibold mb-2">Filtrer par position</div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border/50 space-y-4">
                  <div className="grid gap-4 lg:grid-cols-[1fr,auto] items-start">
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                        {positionFilters.map((value, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Position {index + 1}</span>
                            </div>
                            <div className="relative">
                              <Input
                                type="number"
                                inputMode="numeric"
                                pattern="[1-9]*"
                                min={1}
                                max={9}
                                value={value ?? ""}
                                onChange={(e) => handlePositionFilterChange(index, e.target.value)}
                                className="text-center font-semibold pr-10"
                              />
                              {value !== null && (
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-2 my-auto inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-700 border border-red-400 hover:bg-red-100"
                                  onClick={() => clearPositionFilter(index)}
                                  aria-label={`Effacer la position ${index + 1}`}
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="max-w-[420px] w-full mx-auto">
                      <PuzzleGrid
                        values={positionFilters.map((v) => v ?? "?")}
                        renderSlot={({ index, value, style }) => (
                          <div
                            key={index}
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                            style={style}
                          >
                            <div
                              className={`relative flex items-center justify-center text-2xl font-semibold ${
                                value === "?" ? "text-blue-700" : "text-green-700"
                              }`}
                            >
                              <span
                                className={`absolute -left-3 -top-3 rounded-full text-[10px] px-1.5 py-0.5 ${
                                  value === "?" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                                }`}
                              >
                                {index + 1}
                              </span>
                              {value}
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={clearPositionFilters} disabled={isLoading}>
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {solutions.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground">Tri</span>
              <Select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="w-[220px]">
                <option value="incorrect-first">Fausse d'abord</option>
                <option value="correct-first">Correcte d'abord</option>
                <option value="id-asc">Numéro croissant</option>
                <option value="id-desc">Numéro décroissant</option>
              </Select>
            </div>

            <p className="text-sm font-medium text-muted-foreground">
              {sortedSolutions.length} solution{sortedSolutions.length > 1 ? "s" : ""} affichée
              {sortedSolutions.length > 1 ? "s" : ""}
              {positionFilters.some((v) => v !== null) && " (filtre par position appliqué)"}
            </p>
          </div>

          <SolutionGrid solutions={sortedSolutions} onEdit={setSelectedSolution} onDelete={handleDelete} />
        </div>
      )}

      {selectedSolution && (
        <EditSolutionDialog
          solution={selectedSolution}
          open={!!selectedSolution}
          onOpenChange={(open) => !open && setSelectedSolution(null)}
          onSave={handleUpdate}
        />
      )}

      <div className="max-w-4xl mx-auto rounded-xl border bg-white p-6 shadow-sm space-y-2 text-sm text-gray-700">
        <h2 className="text-lg font-semibold">À propos du puzzle</h2>
        <p>Ce puzzle est devenu viral en 2015 lorsqu'il a été donné à des élèves de CE2 (8 ans) au Vietnam.</p>
        <p>
          Il existe <strong>136 solutions</strong> sur un total de 362,880 arrangements possibles (9!).
        </p>
        <p>
          L'équation suit l'ordre des opérations mathématiques standard (multiplication et division avant addition et
          soustraction).
        </p>
      </div>
    </div>
  )
}
