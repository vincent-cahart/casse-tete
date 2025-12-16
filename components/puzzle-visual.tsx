"use client"

export function PuzzleVisual() {
  return (
    <div className="bg-muted/30 rounded-lg p-6">
      <div className="font-mono text-lg md:text-xl leading-relaxed text-center space-y-1">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>+</span>
          <span>13 ×</span>
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>÷</span>
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>+</span>
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>+</span>
          <span>12 ×</span>
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>−</span>
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>−</span>
        </div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span>11 +</span>
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>×</span>
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>÷</span>
          <span className="inline-flex items-center justify-center size-10 rounded bg-primary/10 text-primary font-bold border-2 border-primary/30">
            ?
          </span>
          <span>−</span>
          <span>10</span>
        </div>
        <div className="text-2xl font-bold text-primary pt-4 border-t border-border mt-4">= 66</div>
      </div>
    </div>
  )
}
