import { getSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import { validateSolution } from "@/lib/solver"

// GET single solution
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.from("puzzle_solutions").select("*").eq("id", id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ solution: data })
}

// PUT - Update solution
export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const body = await request.json()

  const validation = validateSolution(body.solution)

  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("puzzle_solutions")
    .update({
      solution: body.solution,
      equation: validation.equation,
      status: validation.isValid ? "correct" : "incorrect",
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    solution: data,
    validation: {
      isValid: validation.isValid,
      result: validation.result,
    },
  })
}

// DELETE single solution
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("puzzle_solutions").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Solution deleted" })
}
