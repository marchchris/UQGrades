package com.uqgrades.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Course")
public class Course {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  @Column(name = "id")
  private Long id;

  @Column(name = "name") private String name;

  @Column(name = "description") private String description;

  @Column(name = "year") private Integer year;

  @Column(name = "semester") private Integer semester;

  @Column(name = "data") private String data;

  public Course() {}

  public Course(String name, String description, Integer year, Integer semester,
                String data) {
    this.name = name;
    this.description = description;
    this.year = year;
    this.semester = semester;
    this.data = data;
  }

  public Long getId() { return id; }

  public void setId(Long id) { this.id = id; }

  public String getName() { return name; }

  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }

  public void getDescription(String description) {
    this.description = description;
  }

  public Integer getYear() { return year; }

  public void setYear(Integer year) { this.year = year; }

  public Integer getSemester() { return semester; }

  public void setSemester(Integer semester) { this.semester = semester; }

  public String getData() { return data; }

  public void setData(String data) { this.data = data; }
}
