package com.vietnamese.puzzle.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateSolutionRequest(@NotNull List<Integer> solution) {
}
