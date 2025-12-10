package com.uqgrades.server.controller;

import com.uqgrades.server.model.Course;
import com.uqgrades.server.service.CodeService;
import com.uqgrades.server.service.ConfigService;
import com.uqgrades.server.service.CourseService;
import com.uqgrades.server.utility.CodeScraper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {
  private final CourseService courseService;
  private final CodeService codeService;

  @Autowired
  public ApiController(CourseService courseService, CodeService codeService) {
    this.courseService = courseService;
    this.codeService = codeService;
  }

  // return all course codes at UQ
  @GetMapping("/codes")
  public ResponseEntity<?> getCodes() {

    return new ResponseEntity<>(this.codeService.getAllCodes(), HttpStatus.OK);
  }

  // return course offering
  @GetMapping("/{name}/{yearStr}/{semesterStr}")
  public ResponseEntity<?> getCourse(@PathVariable String name,
                                     @PathVariable String yearStr,
                                     @PathVariable String semesterStr) {

    // check course code follows convention
    if (!name.matches("^[A-Za-z]{4}\\d{4}$")) {
      return ResponseEntity.badRequest().body(
          "Invalid name format. Expected 4 letters followed by 4 digits.");
    }

    // check year is a valid year
    if (!yearStr.matches("^\\d{4}$")) {
      return ResponseEntity.badRequest().body(
          "Invalid year format. Expected a 4-digit number.");
    }

    // check semester is 1 - 3
    if (!semesterStr.matches("^[1-3]$")) {
      return ResponseEntity.badRequest().body(
          "Invalid semester. Expected a number from 1 to 3.");
    }

    Integer year = Integer.parseInt(yearStr);
    Integer semester = Integer.parseInt(semesterStr);

    Course course = this.courseService.getCourse(name, year, semester);

    if (course != null) {
      return new ResponseEntity<>(
          this.courseService.getCourse(name, year, semester),
          HttpStatus.OK); // return course
    } else {
      return new ResponseEntity<>(
          String.format("%s %s Semester %s does not exist", name, year,
                        semester),
          HttpStatus.NOT_FOUND); // could not find course
    }
  }
}
