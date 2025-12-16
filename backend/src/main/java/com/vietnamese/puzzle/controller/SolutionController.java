package com.vietnamese.puzzle.controller;

import com.vietnamese.puzzle.dto.SolutionDto;
import com.vietnamese.puzzle.dto.UpdateSolutionRequest;
import com.vietnamese.puzzle.model.PuzzleSolution;
import com.vietnamese.puzzle.service.PuzzleSolverService;
import com.vietnamese.puzzle.service.SolutionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solutions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4200"})
public class SolutionController {

    private final SolutionService solutionService;

    public SolutionController(SolutionService solutionService) {
        this.solutionService = solutionService;
    }

    @GetMapping
    public Map<String, Object> listSolutions(@RequestParam(value = "filter", required = false) String filter) {
        List<SolutionDto> solutions = solutionService.getSolutions(filter).stream()
                .map(SolutionDto::fromEntity)
                .toList();

        return Map.of("solutions", solutions);
    }

    @PostMapping
    public Map<String, Object> generateSolutions() {
        SolutionService.GenerationResult result = solutionService.generateAndSaveAll();

        List<SolutionDto> solutions = result.solutions().stream()
                .map(SolutionDto::fromEntity)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("solutions", solutions);
        response.put("count", solutions.size());
        response.put("computationTime", result.computationTimeMs());
        return response;
    }

    @DeleteMapping
    public Map<String, String> deleteAll() {
        solutionService.deleteAll();
        return Map.of("message", "Toutes les solutions ont été supprimées");
    }

    @GetMapping("/{id}")
    public Map<String, Object> getSolution(@PathVariable Long id) {
        PuzzleSolution solution = solutionService.getSolution(id);
        return Map.of("solution", SolutionDto.fromEntity(solution));
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateSolution(@PathVariable Long id, @Valid @RequestBody UpdateSolutionRequest request) {
        PuzzleSolverService.PuzzleValidation validation = solutionService.validate(request.solution());
        PuzzleSolution updated = solutionService.updateSolution(id, request.solution());

        Map<String, Object> validationPayload = Map.of(
                "isValid", validation.isValid(),
                "result", validation.result()
        );

        return Map.of(
                "solution", SolutionDto.fromEntity(updated),
                "validation", validationPayload
        );
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteSolution(@PathVariable Long id) {
        solutionService.deleteById(id);
        return Map.of("message", "Solution supprimée");
    }
}
