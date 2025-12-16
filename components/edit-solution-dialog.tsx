"use client"

import { useState, useEffect } from "react"
import type { Solution } from "@/lib/types"
import { Loader2, X } from "lucide-react"
import { API_ENDPOINTS } from "@/lib/api"
import { PuzzleGrid } from "./puzzle-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    open && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={() => onOpenChange(false)}
        role="presentation"
      >
        <div
          className="w-full max-w-2xl rounded-lg bg-white shadow-lg p-6 space-y-6"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Modifier la Solution #{solution.id}</h2>
              <p className="text-sm text-gray-600">Modifiez les positions puis enregistrez.</p>
            </div>
            <button
              className="rounded border px-2 py-1 text-sm hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
              aria-label="Fermer"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {positions.map((pos, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`pos-${index}`} className="text-xs text-gray-600">
                    Position {index + 1}
                  </Label>
                  <Input
                    id={`pos-${index}`}
                    type="number"
                    min="1"
                    max="9"
                    value={pos}
                    onChange={(e) => handlePositionChange(index, e.target.value)}
                    className="w-full text-center font-mono text-lg"
                  />
                </div>
              ))}
            </div>
            <div className="min-h-[32px] space-y-1 text-xs">
              {hasDuplicates && <p className="text-red-600">⚠ Chaque chiffre de 1 à 9 doit être utilisé une seule fois</p>}
              {!hasAllDigits && <p className="text-red-600">⚠ Les valeurs doivent être entre 1 et 9</p>}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label className="text-sm font-medium">Aperçu</Label>
            <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
              <PuzzleGrid values={positions} className="max-w-3xl mx-auto" />
              <div className="text-xs text-gray-500 text-center">La validation est faite côté serveur à l'enregistrement.</div>
            </div>
          </div>

          {validationMessage && <div className="rounded-lg bg-red-50 text-red-700 text-sm p-3">{validationMessage}</div>}

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isValidating}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={!canSave}>
              {isValidating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isValidating ? "Validation en cours..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </div>
    )
  )
}
