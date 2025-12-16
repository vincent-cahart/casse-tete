package com.vietnamese.puzzle.service;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PuzzleSolverServiceTest {

    private final PuzzleSolverService solverService = new PuzzleSolverService();

    @Test
    void solve_returnsAllValidSolutions() {
        List<PuzzleSolverService.SolutionCandidate> solutions = solverService.solve();

        assertThat(solutions).isNotEmpty();
        assertThat(solutions.size()).isEqualTo(136);
        assertThat(solutions.getFirst().positions()).hasSize(9);
    }

    @Test
    void validate_detectsInvalidInput() {
        List<Integer> invalid = Arrays.asList(1, 1, 2, 3, 4, 5, 6, 7, 8);
        PuzzleSolverService.PuzzleValidation validation = solverService.validate(invalid);

        assertThat(validation.isValid()).isFalse();
    }
}
