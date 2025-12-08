package com.uqgrades.server.controller;

import com.uqgrades.server.model.Course;
import com.uqgrades.server.service.CodeService;
import com.uqgrades.server.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiController {
  CourseService courseService;
  CodeService codeService;

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
  @GetMapping("/{name}/{year}/{semester}")
  public ResponseEntity<?> getCourse(@PathVariable String name,
                                     @PathVariable Integer year,
                                     @PathVariable Integer semester) {

    return new ResponseEntity<>(
        this.courseService.getCourse(name, year, semester), HttpStatus.OK);
  }
}
