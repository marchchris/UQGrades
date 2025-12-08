package com.uqgrades.server.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Code")
public class Code {
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Id
  @Column(name = "id")
  private Long id;

  @Column(name = "code") private String code;

  public Code() {}

  public Code(String code) { this.code = code; }

  public String getCode() { return code; }

  public void setCode(String code) { this.code = code; }
}
