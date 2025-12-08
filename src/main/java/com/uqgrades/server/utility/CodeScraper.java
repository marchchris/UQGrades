package com.uqgrades.server.utility;

import com.uqgrades.server.model.Code;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class CodeScraper {
  public static List<Code> scrapeCodes() {
    String URL = "https://programs-courses.uq.edu.au/"
                 + "search.html?keywords=&searchType=coursecode&archived=true&"
                 + "CourseParameters%5Bsemester%5D=";

    List<Code> codes = new ArrayList<>();

    try {
      Document doc = Jsoup.connect(URL).get();

      Element coursesContainer = doc.getElementById("courses-container");
      Element ul = coursesContainer.selectFirst("ul.listing");

      Elements rows = ul.select("h2.trigger");

      // extract code, description from listing and add to list
      for (Element li : rows) {
        String code = li.selectFirst("a.code").text();
        String description = li.selectFirst("a.title").text();

        codes.add(new Code(code, description));
      }
    } catch (IOException e) {
      System.err.println(e);
    }

    return codes;
  }
}
