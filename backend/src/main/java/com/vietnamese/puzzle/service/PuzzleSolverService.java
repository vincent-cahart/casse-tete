package com.vietnamese.puzzle.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PuzzleSolverService {

    private static final double TARGET = 66.0;
    private static final double TOLERANCE = 1e-6;

    public static class PuzzleValidation {
        private final boolean isValid;
        private final String equation;
        private final double result;

        public PuzzleValidation(boolean isValid, String equation, double result) {
            this.isValid = isValid;
            this.equation = equation;
            this.result = result;
        }

        public boolean isValid() {
            return isValid;
        }

        public String equation() {
            return equation;
        }

        public double result() {
            return result;
        }
    }

    public static class SolutionCandidate {
        private final List<Integer> positions;
        private final String equation;
        private final double result;

        public SolutionCandidate(List<Integer> positions, String equation, double result) {
            this.positions = positions;
            this.equation = equation;
            this.result = result;
        }

        public List<Integer> positions() {
            return positions;
        }

        public String equation() {
            return equation;
        }

        public double result() {
            return result;
        }
    }

    public PuzzleValidation validate(List<Integer> positions) {
        if (positions == null || positions.size() != 9) {
            return new PuzzleValidation(false, formatEquation(positions), 0.0);
        }

        Set<Integer> unique = new HashSet<>(positions);
        boolean containsAllDigits = unique.size() == 9 && positions.stream().allMatch(d -> d >= 1 && d <= 9);

        if (!containsAllDigits) {
            return new PuzzleValidation(false, formatEquation(positions), 0.0);
        }

        double result = evaluate(positions);
        boolean isValid = Math.abs(result - TARGET) < TOLERANCE;

        return new PuzzleValidation(isValid, formatEquation(positions), result);
    }

    public List<SolutionCandidate> solve() {
        List<SolutionCandidate> solutions = new ArrayList<>();
        boolean[] used = new boolean[10];
        int[] current = new int[9];
        backtrack(0, used, current, solutions);
        return solutions;
    }

    private void backtrack(int depth, boolean[] used, int[] current, List<SolutionCandidate> solutions) {
        if (depth == 9) {
            List<Integer> positions = new ArrayList<>(9);
            for (int value : current) {
                positions.add(value);
            }
            PuzzleValidation validation = validate(positions);

            if (validation.isValid()) {
                solutions.add(new SolutionCandidate(positions, validation.equation(), validation.result()));
            }
            return;
        }

        for (int digit = 1; digit <= 9; digit++) {
            if (!used[digit]) {
                used[digit] = true;
                current[depth] = digit;
                backtrack(depth + 1, used, current, solutions);
                used[digit] = false;
            }
        }
    }

    private double evaluate(List<Integer> positions) {
        int a = positions.get(0);
        int b = positions.get(1);
        int c = positions.get(2);
        int d = positions.get(3);
        int e = positions.get(4);
        int f = positions.get(5);
        int g = positions.get(6);
        int h = positions.get(7);
        int i = positions.get(8);

        double term1 = a;
        double term2 = (13.0 * b) / c;
        double term3 = d;
        double term4 = 12.0 * e;
        double term5 = f;
        double term6 = 11.0;
        double term7 = (g * h) / (double) i;
        double term8 = 10.0;

        return term1 + term2 + term3 + term4 - term5 - term6 + term7 - term8;
    }

    private String formatEquation(List<Integer> positions) {
        if (positions == null || positions.size() != 9) {
            return "? + 13×? ÷ ? + ? + 12×? − ? − 11 + ?×? ÷ ? − 10 = 66";
        }

        return String.format("%d + 13×%d÷%d + %d + 12×%d − %d − 11 + %d×%d÷%d − 10 = 66",
                positions.get(0), positions.get(1), positions.get(2), positions.get(3), positions.get(4),
                positions.get(5), positions.get(6), positions.get(7), positions.get(8));
    }
}
