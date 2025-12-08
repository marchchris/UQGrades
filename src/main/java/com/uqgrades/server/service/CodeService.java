package com.uqgrades.server.service;

import com.uqgrades.server.model.Code;
import com.uqgrades.server.repository.CodeRepository;
import com.uqgrades.server.utility.CodeScraper;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CodeService {
  private CodeRepository codeRepo;

  @Autowired
  public CodeService(CodeRepository codeRepo) {
    this.codeRepo = codeRepo;
  }

  // return all course codes as List
  public List<Code> getAllCodes() {
    List<Code> codes = codeRepo.findAll();

    // codes not stored in database
    if (codes.isEmpty()) {
      codes = CodeScraper.scrapeCodes();

      if (codes.isEmpty()) {
        return null; // no codes were returned
      }

      return codeRepo.saveAll(codes);
    }

    return codes;
  }
}
