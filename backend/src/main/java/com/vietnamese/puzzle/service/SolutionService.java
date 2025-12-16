package com.vietnamese.puzzle.service;

import com.vietnamese.puzzle.model.PuzzleSolution;
import com.vietnamese.puzzle.model.SolutionStatus;
import com.vietnamese.puzzle.repository.PuzzleSolutionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class SolutionService {

    public record GenerationResult(List<PuzzleSolution> solutions, long computationTimeMs) {}

    private final PuzzleSolutionRepository repository;
    private final PuzzleSolverService solverService;

    public SolutionService(PuzzleSolutionRepository repository, PuzzleSolverService solverService) {
        this.repository = repository;
        this.solverService = solverService;
    }

    public List<PuzzleSolution> getSolutions(String filter) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        if (filter != null && !filter.isBlank()) {
            return repository.findByEquationContainingIgnoreCase(filter, sort);
        }

        return repository.findAll(sort);
    }

    public PuzzleSolution getSolution(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solution non trouvée"));
    }

    public GenerationResult generateAndSaveAll() {
        long start = System.nanoTime();

        List<PuzzleSolverService.SolutionCandidate> solved = solverService.solve();

        List<PuzzleSolution> entities = solved.stream()
                .map(candidate -> new PuzzleSolution(
                        candidate.positions(),
                        candidate.equation(),
                        candidate.result(),
                        SolutionStatus.CORRECT))
                .toList();

        List<PuzzleSolution> saved = repository.saveAll(entities);

        long durationMs = (System.nanoTime() - start) / 1_000_000;
        return new GenerationResult(saved, durationMs);
    }

    public PuzzleSolution updateSolution(Long id, List<Integer> positions) {
        PuzzleSolution solution = getSolution(id);

        PuzzleSolverService.PuzzleValidation validation = solverService.validate(positions);

        solution.setSolution(positions);
        solution.setEquation(validation.equation());
        solution.setResult(validation.result());
        solution.setStatus(validation.isValid() ? SolutionStatus.CORRECT : SolutionStatus.INCORRECT);

        return repository.save(solution);
    }

    public void deleteAll() {
        repository.deleteAll();
    }

    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Solution non trouvée");
        }
        repository.deleteById(id);
    }

    public PuzzleSolverService.PuzzleValidation validate(List<Integer> positions) {
        return solverService.validate(positions);
    }
}
