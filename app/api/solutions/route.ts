import { getSupabaseServerClient } from "@/lib/supabase-server"
import { solvePuzzle } from "@/lib/solver"
import { NextResponse } from "next/server"

// GET all solutions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get("filter")

  const supabase = await getSupabaseServerClient()

  let query = supabase.from("puzzle_solutions").select("*").order("created_at", { ascending: false })

  if (filter) {
    query = query.ilike("equation", `%${filter}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ solutions: data })
}

// POST - Generate and save all solutions
export async function POST() {
  const startTime = performance.now()

  const supabase = await getSupabaseServerClient()

  // First, solve the puzzle
  const solutions = solvePuzzle()

  // Prepare data for batch insert
  const solutionsToInsert = solutions.map((sol) => ({
    solution: sol.positions,
    equation: sol.equation,
    result: 66,
    status: "correct",
  }))

  // Insert all solutions
  const { data, error } = await supabase.from("puzzle_solutions").insert(solutionsToInsert).select()

  const endTime = performance.now()
  const computationTime = endTime - startTime

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    solutions: data,
    count: data.length,
    computationTime,
  })
}

// DELETE all solutions
export async function DELETE() {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("puzzle_solutions").delete().neq("id", 0) // Delete all rows

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "All solutions deleted" })
}
