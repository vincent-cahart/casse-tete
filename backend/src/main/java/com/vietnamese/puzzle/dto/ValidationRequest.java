package com.vietnamese.puzzle.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record ValidationRequest(@NotNull List<Integer> positions) {
}
