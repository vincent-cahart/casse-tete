/**
 * Solves the Vietnamese puzzle: ? + 13×? ÷ ? + ? + 12×? − ? − 11 + ?×? ÷ ? − 10 = 66
 *
 * The positions array represents:
 * [0] + 13×[1] ÷ [2] + [3] + 12×[4] − [5] − 11 + [6]×[7] ÷ [8] − 10 = 66
 */

function evaluateEquation(positions: number[]): number {
  const [a, b, c, d, e, f, g, h, i] = positions

  // Follow order of operations: multiply and divide first, then add and subtract
  const term1 = a
  const term2 = (13 * b) / c
  const term3 = d
  const term4 = 12 * e
  const term5 = f
  const term6 = 11
  const term7 = (g * h) / i
  const term8 = 10

  const result = term1 + term2 + term3 + term4 - term5 - term6 + term7 - term8

  return result
}

function formatEquation(positions: number[]): string {
  const [a, b, c, d, e, f, g, h, i] = positions
  return `${a} + 13×${b}÷${c} + ${d} + 12×${e} − ${f} − 11 + ${g}×${h}÷${i} − 10 = 66`
}

function permute(arr: number[]): number[][] {
  if (arr.length <= 1) return [arr]

  const result: number[][] = []

  for (let i = 0; i < arr.length; i++) {
    const current = arr[i]
    const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)]
    const remainingPerms = permute(remaining)

    for (const perm of remainingPerms) {
      result.push([current, ...perm])
    }
  }

  return result
}

export function validateSolution(positions: number[]): { isValid: boolean; equation: string; result: number } {
  // Check if we have exactly 9 unique digits from 1 to 9
  const sortedPositions = [...positions].sort((a, b) => a - b)
  const isValidInput = positions.length === 9 && sortedPositions.every((val, idx) => val === idx + 1)

  if (!isValidInput) {
    return {
      isValid: false,
      equation: formatEquation(positions),
      result: 0,
    }
  }

  const result = evaluateEquation(positions)
  const equation = formatEquation(positions)

  // Check if result equals 66 (with floating point tolerance)
  const isValid = Math.abs(result - 66) < 0.0001

  return {
    isValid,
    equation,
    result,
  }
}

export function solvePuzzle() {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const permutations = permute(digits)
  const solutions: Array<{ positions: number[]; equation: string }> = []

  for (const perm of permutations) {
    const validation = validateSolution(perm)

    // Check if result equals 66 (with floating point tolerance)
    if (validation.isValid) {
      solutions.push({
        positions: perm,
        equation: validation.equation,
      })
    }
  }

  return solutions
}
