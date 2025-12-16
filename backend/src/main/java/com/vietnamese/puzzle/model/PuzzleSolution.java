package com.vietnamese.puzzle.model;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "puzzle_solutions")
public class PuzzleSolution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Convert(converter = IntegerListConverter.class)
    @Column(name = "solution_data", nullable = false, length = 64)
    private List<Integer> solution;

    @Column(nullable = false, length = 255)
    private String equation;

    @Column(nullable = false)
    private double result;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private SolutionStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    public PuzzleSolution() {
    }

    public PuzzleSolution(List<Integer> solution, String equation, double result, SolutionStatus status) {
        this.solution = solution;
        this.equation = equation;
        this.result = result;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public List<Integer> getSolution() {
        return solution;
    }

    public void setSolution(List<Integer> solution) {
        this.solution = solution;
    }

    public String getEquation() {
        return equation;
    }

    public void setEquation(String equation) {
        this.equation = equation;
    }

    public double getResult() {
        return result;
    }

    public void setResult(double result) {
        this.result = result;
    }

    public SolutionStatus getStatus() {
        return status;
    }

    public void setStatus(SolutionStatus status) {
        this.status = status;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }
}
