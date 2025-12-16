package com.vietnamese.puzzle.service;

import com.vietnamese.puzzle.model.PuzzleSolution;
import com.vietnamese.puzzle.model.SolutionStatus;
import com.vietnamese.puzzle.repository.PuzzleSolutionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolutionServiceTest {

    @Mock
    private PuzzleSolutionRepository repository;

    @Mock
    private PuzzleSolverService solverService;

    @InjectMocks
    private SolutionService service;

    private PuzzleSolution sampleSolution;

    @BeforeEach
    void setup() {
        sampleSolution = new PuzzleSolution(List.of(1,2,3,4,5,6,7,8,9), "eq", 66.0, SolutionStatus.CORRECT);
    }

    @Test
    void getSolutions_withoutFilter_usesFindAll() {
        when(repository.findAll(any(Sort.class))).thenReturn(List.of(sampleSolution));

        List<PuzzleSolution> results = service.getSolutions(null);

        assertEquals(1, results.size());
        verify(repository).findAll(any(Sort.class));
    }

    @Test
    void getSolutions_withFilter_usesFindByEquation() {
        when(repository.findByEquationContainingIgnoreCase(eq("66"), any(Sort.class))).thenReturn(List.of(sampleSolution));

        List<PuzzleSolution> results = service.getSolutions("66");

        assertEquals(1, results.size());
        verify(repository).findByEquationContainingIgnoreCase(eq("66"), any(Sort.class));
    }

    @Test
    void generateAndSaveAll_mapsCandidates() {
        PuzzleSolverService.SolutionCandidate candidate = new PuzzleSolverService.SolutionCandidate(
                List.of(1,2,3,4,5,6,7,8,9), "eq", 66.0);

        when(solverService.solve()).thenReturn(List.of(candidate));
        when(repository.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

        SolutionService.GenerationResult result = service.generateAndSaveAll();

        assertEquals(1, result.getSolutions().size());
        verify(repository).saveAll(anyList());
    }

    @Test
    void updateSolution_setsStatusFromValidation() {
        when(repository.findById(1L)).thenReturn(Optional.of(sampleSolution));
        when(solverService.validate(anyList())).thenReturn(new PuzzleSolverService.PuzzleValidation(true, "eq", 66.0));
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        PuzzleSolution updated = service.updateSolution(1L, List.of(9,8,7,6,5,4,3,2,1));

        assertEquals(SolutionStatus.CORRECT, updated.getStatus());
        verify(repository).save(any(PuzzleSolution.class));
    }

    @Test
    void deleteById_throwsWhenMissing() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThrows(ResponseStatusException.class, () -> service.deleteById(99L));
    }

    @Test
    void deleteById_deletesWhenExists() {
        when(repository.existsById(1L)).thenReturn(true);

        service.deleteById(1L);

        verify(repository).deleteById(1L);
    }
}
