package com.vietnamese.puzzle.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PuzzleSolverServiceTest {

    private final PuzzleSolverService solverService = new PuzzleSolverService();

    @Test
    void solve_and_validate_basicPaths() {
        List<PuzzleSolverService.SolutionCandidate> solutions = solverService.solve();
        assertEquals(136, solutions.size());

        List<Integer> valid = solutions.getFirst().positions();
        assertTrue(solverService.validate(valid).isValid());

        assertFalse(solverService.validate(List.of(1, 1, 2, 3, 4, 5, 6, 7, 8)).isValid());
        assertFalse(solverService.validate(List.of(1, 2, 3)).isValid());
    }
}
