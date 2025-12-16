import type { SelectHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type Props = SelectHTMLAttributes<HTMLSelectElement>

export function Select({ className, children, ...props }: Props) {
  return (
    <select
      className={cn("w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200", className)}
      {...props}
    >
      {children}
    </select>
  )
}
