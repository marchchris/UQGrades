package com.uqgrades.server.controller;

import com.uqgrades.server.model.Course;
import com.uqgrades.server.service.CourseService;
import com.uqgrades.server.utility.CourseScraper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {
  CourseService courseService;

  @Autowired
  public TestController(CourseService courseService) {
    this.courseService = courseService;
  }

  @GetMapping("/")
  public ResponseEntity<?> test() {

    Course course = CourseScraper.scrapeCourse("MATH1051", 2025, 1);

    return new ResponseEntity<>(course, HttpStatus.OK);
  }
}
