package com.vietnamese.puzzle.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vietnamese.puzzle.dto.UpdateSolutionRequest;
import com.vietnamese.puzzle.dto.ValidationRequest;
import com.vietnamese.puzzle.model.PuzzleSolution;
import com.vietnamese.puzzle.model.SolutionStatus;
import com.vietnamese.puzzle.service.PuzzleSolverService;
import com.vietnamese.puzzle.service.SolutionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(SolutionController.class)
class SolutionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SolutionService solutionService;

    private PuzzleSolution sampleSolution() {
        return new PuzzleSolution(List.of(1,2,3,4,5,6,7,8,9), "eq", 66.0, SolutionStatus.CORRECT);
    }

    @Test
    void listSolutions_returnsPayload() throws Exception {
        Mockito.when(solutionService.getSolutions(null)).thenReturn(List.of(sampleSolution()));

        mockMvc.perform(get("/api/solutions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solutions").isArray());
    }

    @Test
    void generateSolutions_returnsCount() throws Exception {
        SolutionService.GenerationResult result = new SolutionService.GenerationResult(List.of(sampleSolution()), 5);
        Mockito.when(solutionService.generateAndSaveAll()).thenReturn(result);

        mockMvc.perform(post("/api/solutions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.count").value(1))
                .andExpect(jsonPath("$.solutions[0].solution").isArray());
    }

    @Test
    void getSolution_returnsOne() throws Exception {
        Mockito.when(solutionService.getSolution(1L)).thenReturn(sampleSolution());

        mockMvc.perform(get("/api/solutions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solution.solution").isArray());
    }

    @Test
    void updateSolution_returnsUpdated() throws Exception {
        PuzzleSolution updated = sampleSolution();
        Mockito.when(solutionService.validate(anyList())).thenReturn(new PuzzleSolverService.PuzzleValidation(true, "eq", 66.0));
        Mockito.when(solutionService.updateSolution(eq(1L), anyList())).thenReturn(updated);

        UpdateSolutionRequest payload = new UpdateSolutionRequest(List.of(9,8,7,6,5,4,3,2,1));

        mockMvc.perform(put("/api/solutions/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.solution.solution").isArray())
                .andExpect(jsonPath("$.validation.isValid").value(true));
    }

    @Test
    void deleteAll_returnsMessage() throws Exception {
        mockMvc.perform(delete("/api/solutions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void deleteOne_returnsMessage() throws Exception {
        mockMvc.perform(delete("/api/solutions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void validatePuzzle_returnsPayload() throws Exception {
        Mockito.when(solutionService.validate(anyList())).thenReturn(new PuzzleSolverService.PuzzleValidation(true, "eq", 66.0));

        mockMvc.perform(post("/api/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ValidationRequest(List.of(1,2,3,4,5,6,7,8,9)))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isValid").value(true))
                .andExpect(jsonPath("$.result").value(66.0));
    }
}
