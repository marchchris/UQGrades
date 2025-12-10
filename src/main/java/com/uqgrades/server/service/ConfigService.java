package com.uqgrades.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ConfigService {

  private static String profileURL;
  private static String courseURL;
  private static String baseURL;

  @Value("${uq.profile.url}")
  public void setProfileURL(String profileURL) {
    ConfigService.profileURL = profileURL;
  }

  @Value("${uq.course.url}")
  public void setCourseURL(String courseURL) {
    ConfigService.courseURL = courseURL;
  }

  @Value("${base.url}")
  public void setBaseURL(String baseURL) {
    ConfigService.baseURL = baseURL;
  }

  public static String getProfileUrl() { return profileURL; }

  public static String getCourseUrl() { return courseURL; }

  public static String getBaseUrl() { return baseURL; }
}
