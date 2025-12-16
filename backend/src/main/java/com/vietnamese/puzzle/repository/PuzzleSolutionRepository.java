package com.vietnamese.puzzle.repository;

import com.vietnamese.puzzle.model.PuzzleSolution;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PuzzleSolutionRepository extends JpaRepository<PuzzleSolution, Long> {
    List<PuzzleSolution> findByEquationContainingIgnoreCase(String equation, Sort sort);
}
