import { PuzzleSolver } from "@/components/puzzle-solver"
import { Suspense } from "react"

export const metadata = {
  title: "Puzzle Vietnamien - Résolveur",
  description: "Résolvez le célèbre puzzle mathématique vietnamien de 2015",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Chargement...</div>}>
        <PuzzleSolver />
      </Suspense>
    </main>
  )
}
