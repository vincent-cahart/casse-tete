package com.vietnamese.puzzle.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.vietnamese.puzzle.model.PuzzleSolution;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record SolutionDto(
        Long id,
        List<Integer> solution,
        String equation,
        double result,
        String status,
        OffsetDateTime createdAt
) {

    public static SolutionDto fromEntity(PuzzleSolution entity) {
        return new SolutionDto(
                entity.getId(),
                entity.getSolution(),
                entity.getEquation(),
                entity.getResult(),
                entity.getStatus().name().toLowerCase(Locale.ROOT),
                entity.getCreatedAt()
        );
    }
}
