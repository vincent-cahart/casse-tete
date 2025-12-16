"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calculator, Clock, Database, Trash2, Search } from "lucide-react"
import { SolutionGrid } from "./solution-grid"
import { PuzzleVisual } from "./puzzle-visual"
import { EditSolutionDialog } from "./edit-solution-dialog"
import type { Solution } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { API_ENDPOINTS } from "@/lib/api"

export function PuzzleSolver() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [computationTime, setComputationTime] = useState<number | null>(null)
  const [filterValue, setFilterValue] = useState<string>("")
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null)
  const { toast } = useToast()

  // Load solutions on mount
  useEffect(() => {
    loadSolutions()
  }, [])

  const loadSolutions = async (filter?: string) => {
    setIsLoading(true)
    try {
      const url = filter
        ? `${API_ENDPOINTS.solutions}?filter=${encodeURIComponent(filter)}`
        : API_ENDPOINTS.solutions
      const response = await fetch(url)
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
    loadSolutions(filterValue)
  }

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
              <div className="flex gap-2">
                <Input
                  placeholder="Rechercher dans les solutions (ex: 9 + 13)"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="size-4 mr-2" />
                  Filtrer
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {solutions.length} solution{solutions.length > 1 ? "s" : ""} enregistrée
                  {solutions.length > 1 ? "s" : ""}
                  {filterValue && ` (filtré sur "${filterValue}")`}
                </p>
                {filterValue && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFilterValue("")
                      loadSolutions()
                    }}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {solutions.length > 0 && (
        <SolutionGrid solutions={solutions} onEdit={setSelectedSolution} onDelete={handleDelete} />
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
