package com.vietnamese.puzzle.controller;

import com.vietnamese.puzzle.dto.SolutionDto;
import com.vietnamese.puzzle.dto.UpdateSolutionRequest;
import com.vietnamese.puzzle.dto.ValidationRequest;
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
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4200"})
public class SolutionController {

    private final SolutionService solutionService;

    public SolutionController(SolutionService solutionService) {
        this.solutionService = solutionService;
    }

    @GetMapping("/solutions")
    public Map<String, Object> listSolutions(@RequestParam(value = "filter", required = false) String filter) {
        List<SolutionDto> solutions = solutionService.getSolutions(filter).stream()
                .map(SolutionDto::fromEntity)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("solutions", solutions);
        return response;
    }

    @PostMapping("/solutions")
    public Map<String, Object> generateSolutions() {
        SolutionService.GenerationResult result = solutionService.generateAndSaveAll();

        List<SolutionDto> solutions = result.getSolutions().stream()
                .map(SolutionDto::fromEntity)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("solutions", solutions);
        response.put("count", solutions.size());
        response.put("computationTime", result.getComputationTimeMs());
        return response;
    }

    @DeleteMapping("/solutions")
    public Map<String, String> deleteAll() {
        solutionService.deleteAll();
        Map<String, String> response = new HashMap<>();
        response.put("message", "Toutes les solutions ont été supprimées");
        return response;
    }

    @GetMapping("/solutions/{id}")
    public Map<String, Object> getSolution(@PathVariable Long id) {
        PuzzleSolution solution = solutionService.getSolution(id);
        Map<String, Object> response = new HashMap<>();
        response.put("solution", SolutionDto.fromEntity(solution));
        return response;
    }

    @PutMapping("/solutions/{id}")
    public Map<String, Object> updateSolution(@PathVariable Long id, @Valid @RequestBody UpdateSolutionRequest request) {
        PuzzleSolverService.PuzzleValidation validation = solutionService.validate(request.solution());
        PuzzleSolution updated = solutionService.updateSolution(id, request.solution());

        Map<String, Object> validationPayload = new HashMap<>();
        validationPayload.put("isValid", validation.isValid());
        validationPayload.put("result", validation.result());

        Map<String, Object> response = new HashMap<>();
        response.put("solution", SolutionDto.fromEntity(updated));
        response.put("validation", validationPayload);
        return response;
    }

    @DeleteMapping("/solutions/{id}")
    public Map<String, String> deleteSolution(@PathVariable Long id) {
        solutionService.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Solution supprimée");
        return response;
    }

    @PostMapping("/validate")
    @CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:4200"})
    public Map<String, Object> validatePuzzle(@Valid @RequestBody ValidationRequest request) {
        PuzzleSolverService.PuzzleValidation validation = solutionService.validate(request.positions());

        Map<String, Object> response = new HashMap<>();
        response.put("isValid", validation.isValid());
        response.put("equation", validation.equation());
        response.put("result", validation.result());
        return response;
    }
}
