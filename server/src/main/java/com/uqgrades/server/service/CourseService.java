package com.uqgrades.server.service;

import com.uqgrades.server.model.Course;
import com.uqgrades.server.repository.CourseRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CourseService {
  private CourseRepository courseRepo;

  @Autowired
  public CourseService(CourseRepository courseRepo) {
    this.courseRepo = courseRepo;
  }

  public List<Course> getAllCourses() { return courseRepo.findAll(); }
}
