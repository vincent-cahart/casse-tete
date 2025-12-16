import { NextResponse } from "next/server"
import { solvePuzzle } from "@/lib/solver"

export async function GET() {
  try {
    const solutions = solvePuzzle()

    return NextResponse.json({
      success: true,
      count: solutions.length,
      solutions,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to solve puzzle" }, { status: 500 })
  }
}
