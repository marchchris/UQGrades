package com.uqgrades.server.utility;

import com.google.gson.Gson;
import com.uqgrades.server.model.Course;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class CourseScraper {
  /*
   * returns new course object for offering URL
   */
  private static Course getOffering(String URL, String name, Integer year,
                                    Integer semester) {
    try {
      Document courseProfileDoc = Jsoup.connect(URL).get();

      // select all rows from assessment summary table
      Element assessmentSummaryTable =
          courseProfileDoc.selectFirst("div.assessment-summary-table");
      Element tableBody = assessmentSummaryTable.selectFirst("tbody");
      Elements tableRows = tableBody.select("tr");

      Map<String, String> assessments = new HashMap<>();

      // add each assessment and its weight as mapping
      for (Element row : tableRows) {
        Elements tds = row.select("td");
        Element a = tds.get(1).selectFirst("a");
        assessments.put(a.text(), tds.get(2).text());
      }

      // convert map to json
      Gson gson = new Gson();
      String jsonData = gson.toJson(assessments);

      return new Course(name, year, semester, jsonData);
    } catch (IOException e) {
      System.err.println(e);
    }

    return null;
  }
  /*
   * Scrapes and returns new Course object if found by name, year and semester.
   * Returns null if cannot be found.
   */
  public static Course scrapeCourse(String name, Integer year,
                                    Integer semester) {
    // create URL for course page
    String URL =
        "https://programs-courses.uq.edu.au/course.html?course_code=" + name;

    try {
      Document coursePageDoc = Jsoup.connect(URL).get();

      Element currTable = coursePageDoc.getElementById(
          "course-current-offerings"); // current offerings tables
      Element archTable = coursePageDoc.getElementById(
          "course-archived-offerings"); // archived offerings table

      List<Element> tables = List.of(currTable, archTable);

      for (Element table : tables) {
        Element tableBody = table.selectFirst("tbody");
        Elements rows = tableBody.select("tr");

        for (Element row : rows) {
          Element link =
              row.selectFirst("a.course-offering-year"); // offering link
          Element profile =
              row.selectFirst("a.profile-available"); // offering course profile

          String linkText = link.text();
          String[] words = linkText.split(" ");

          // match for summer semester
          if (semester == 3) {
            if (words[0].equals("Summer") &&
                words[2].equals(Integer.toString(year))) {
              return getOffering(profile.attr("href"), name, year, semester);
            }
          } else {
            // match for exact year and semester
            if (words[0].equals("Semester") &&
                words[1].charAt(0) == Character.forDigit(semester, 10) &&
                words[2].equals(Integer.toString(year))) {

              return getOffering(profile.attr("href"), name, year, semester);
            }
          }
        }
      }
    } catch (IOException e) {
      System.err.println(e);
    }

    return null; // could not find matching offering
  }
}
