"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calculator, Clock, Database, Trash2, X } from "lucide-react"
import { SolutionGrid } from "./solution-grid"
import { PuzzleVisual } from "./puzzle-visual"
import { EditSolutionDialog } from "./edit-solution-dialog"
import { PuzzleGrid } from "./puzzle-grid"
import type { Solution } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { API_ENDPOINTS } from "@/lib/api"
import { cn } from "@/lib/utils"

export function PuzzleSolver() {
  type SortMode = "incorrect-first" | "correct-first" | "id-asc" | "id-desc"

  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [computationTime, setComputationTime] = useState<number | null>(null)
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const [sortMode, setSortMode] = useState<SortMode>("incorrect-first")
  const [positionFilters, setPositionFilters] = useState<Array<number | null>>(Array(9).fill(null))
  const { toast } = useToast()

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
        toast({
          title: "Erreur",
          description: data.error || data.message || "Impossible de charger les solutions",
          variant: "destructive",
        })
      } else {
        setSolutions(data.solutions || [])
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les solutions",
        variant: "destructive",
      })
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
        toast({
          title: "Erreur",
          description: data.error || data.message || "Impossible de générer les solutions",
          variant: "destructive",
        })
      } else {
        setComputationTime(data.computationTime)
        setSolutions(data.solutions)
        toast({
          title: "Succès",
          description: `${data.count} solutions générées et enregistrées en ${data.computationTime.toFixed(2)}ms`,
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer les solutions",
        variant: "destructive",
      })
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
        toast({
          title: "Succès",
          description: "Toutes les solutions ont été supprimées",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Erreur",
          description: data.error || data.message || "Impossible de supprimer les solutions",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les solutions",
        variant: "destructive",
      })
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
        toast({
          title: "Succès",
          description: "Solution supprimée",
        })
      } else {
        const data = await response.json()
        toast({
          title: "Erreur",
          description: data.error || data.message || "Impossible de supprimer la solution",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la solution",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = (updatedSolution: Solution) => {
    setSolutions((prev) => prev.map((s) => (s.id === updatedSolution.id ? updatedSolution : s)))
    setSelectedSolution(null)
    toast({
      title: "Succès",
      description: "Solution mise à jour",
    })
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
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">Le Puzzle Vietnamien</h1>
        <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
          Énigme mathématique virale de 2015 donnée à des élèves de CE2 au Vietnam
        </p>
      </div>

      {/* Puzzle Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5" />
            L'Énigme
          </CardTitle>
          <CardDescription>
            Placez les chiffres de 1 à 9 (chaque chiffre utilisé une seule fois) pour obtenir 66
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <PuzzleVisual />

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button size="lg" onClick={handleGenerate} disabled={isGenerating} className="w-full sm:w-auto">
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
              size="lg"
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={solutions.length === 0 || isGenerating}
              className="w-full sm:w-auto"
            >
              <Trash2 className="mr-2 size-4" />
              Tout Supprimer
            </Button>

            {computationTime !== null && (
              <Badge variant="secondary" className="text-sm gap-2">
                <Clock className="size-3" />
                Temps: {computationTime.toFixed(2)}ms
              </Badge>
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
                              {value !== null && (
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => clearPositionFilter(index)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                            <Input
                              type="number"
                              inputMode="numeric"
                              pattern="[1-9]*"
                              min={1}
                              max={9}
                              value={value ?? ""}
                              onChange={(e) => handlePositionFilterChange(index, e.target.value)}
                              className="text-center font-semibold"
                            />
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
                            <div className="relative flex items-center justify-center text-2xl font-semibold text-primary">
                              <span className="absolute -left-3 -top-3 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
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
              <Select value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Choisir un tri" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incorrect-first">Fausse d'abord</SelectItem>
                  <SelectItem value="correct-first">Correcte d'abord</SelectItem>
                  <SelectItem value="id-asc">Numéro croissant</SelectItem>
                  <SelectItem value="id-desc">Numéro décroissant</SelectItem>
                </SelectContent>
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

      {/* Info Section */}
      <Card className="max-w-4xl mx-auto bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">À propos du puzzle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Ce puzzle est devenu viral en 2015 lorsqu'il a été donné à des élèves de CE2 (8 ans) au Vietnam.</p>
          <p>
            Il existe <strong>136 solutions</strong> sur un total de 362,880 arrangements possibles (9!).
          </p>
          <p>
            L'équation suit l'ordre des opérations mathématiques standard (multiplication et division avant addition et
            soustraction).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
