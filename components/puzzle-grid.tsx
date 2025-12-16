"use client"

import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"

export type GridValue = number | string

export const PUZZLE_SLOTS = [
  { left: "9.028%", top: "12.5%" },
  { left: "9.028%", top: "66.346%" },
  { left: "18.75%", top: "79.808%" },
  { left: "28.472%", top: "66.346%" },
  { left: "28.472%", top: "12.5%" },
  { left: "47.917%", top: "12.5%" },
  { left: "47.917%", top: "66.346%" },
  { left: "57.639%", top: "79.808%" },
  { left: "67.361%", top: "66.346%" },
]

interface PuzzleGridProps {
  values: GridValue[]
  className?: string
  renderSlot?: (args: { index: number; value: GridValue; style: CSSProperties }) => ReactNode
}

export function PuzzleGrid({ values, className = "", renderSlot }: PuzzleGridProps) {
  const displayValues = Array.from({ length: 9 }, (_, index) => values?.[index] ?? "?")

  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: "720 / 520" }}>
      <Image
        src="/grille.svg"
        alt="Grille du puzzle"
        fill
        sizes="(min-width: 1024px) 720px, 100vw"
        className="object-contain select-none"
        priority
      />

      {PUZZLE_SLOTS.map((slot, index) => {
        const style: CSSProperties = { left: slot.left, top: slot.top }
        if (renderSlot) {
          return (
            <div
              key={index}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={style}
            >
              {renderSlot({ index, value: displayValues[index], style })}
            </div>
          )
        }

        return (
          <div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full bg-primary/10 text-primary font-semibold border border-primary/30 text-lg size-12 md:size-14"
            style={style}
          >
            {displayValues[index]}
          </div>
        )
      })}
    </div>
  )
}
