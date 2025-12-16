"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Solution } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/api"
import { PuzzleGrid } from "./puzzle-grid"

interface EditSolutionDialogProps {
  solution: Solution
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (solution: Solution) => void
}

export function EditSolutionDialog({ solution, open, onOpenChange, onSave }: EditSolutionDialogProps) {
  const [positions, setPositions] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9])
  const [isValidating, setIsValidating] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string>("")

  useEffect(() => {
    if (solution) {
      setPositions([...solution.solution])
      setValidationMessage("")
    }
  }, [solution])

  const handlePositionChange = (index: number, value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 9) {
      const newPositions = [...positions]
      newPositions[index] = numValue
      setPositions(newPositions)
      setValidationMessage("")
    }
  }

  const handleSave = async () => {
    setIsValidating(true)
    setValidationMessage("")

    try {
      const response = await fetch(`${API_ENDPOINTS.solutions}/${solution.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution: positions }),
      })

      const data = await response.json()

      if (response.ok) {
        onSave(data.solution)
        onOpenChange(false)
      } else {
        setValidationMessage(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      setValidationMessage("Erreur de connexion au serveur")
    } finally {
      setIsValidating(false)
    }
  }

  const hasDuplicates = new Set(positions).size !== 9
  const hasAllDigits = positions.every((p) => p >= 1 && p <= 9)
  const canSave = !hasDuplicates && hasAllDigits && !isValidating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la Solution #{solution.id}</DialogTitle>
          <DialogDescription>
            Modifiez les positions des chiffres. Le serveur validera automatiquement si la solution est correcte.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Positions des chiffres (1 à 9)</Label>
            <div className="grid grid-cols-3 gap-3">
              {positions.map((pos, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`pos-${index}`} className="text-xs text-muted-foreground">
                    Position {index + 1}
                  </Label>
                  <Input
                    id={`pos-${index}`}
                    type="number"
                    min="1"
                    max="9"
                    value={pos}
                    onChange={(e) => handlePositionChange(index, e.target.value)}
                    className="font-mono text-center text-lg"
                  />
                </div>
              ))}
            </div>
            <div className="min-h-[32px] space-y-1 text-xs">
              {hasDuplicates && (
                <p className="text-destructive">⚠ Chaque chiffre de 1 à 9 doit être utilisé une seule fois</p>
              )}
              {!hasAllDigits && <p className="text-destructive">⚠ Les valeurs doivent être entre 1 et 9</p>}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Aperçu de l'équation</Label>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <PuzzleGrid values={positions} className="max-w-3xl mx-auto" />
              <div className="text-xs text-muted-foreground text-center">
                Les chiffres seront validés par le serveur lors de l'enregistrement
              </div>
            </div>
          </div>

          {validationMessage && (
            <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">{validationMessage}</div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isValidating}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={!canSave}>
            {isValidating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isValidating ? "Validation en cours..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
