"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import { LoadingPage } from "@/components/loading";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";

export default function Calculator() {
  const params = useParams();

  const courseCode = params.code;
  const year = params.year;
  const semester = params.semester;

  const [courseData, setCourseData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/${courseCode}/${year}/${semester}`,
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const jsonData = await response.json();
        setCourseData(jsonData);
        setAssessmentData(JSON.parse(jsonData.data));
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-8">
      <div>
        <h1 className="text-xl">
          {courseCode} - {year} -{" "}
          {semester != 3 ? (
            <span>Semester {semester}</span>
          ) : (
            <span>Summer Semester</span>
          )}
        </h1>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment</TableHead>
              <TableHead>Weighting</TableHead>
              <TableHead>Your Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.keys(assessmentData).map((key) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {assessmentData[key] == "Pass"
                    ? "Pass / Fail"
                    : assessmentData[key]}
                </TableCell>
                <TableCell>
                  <Input placeholder="70, 70%, 7/10"></Input>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grade</TableHead>
              <TableHead>Cutoff (%)</TableHead>
              <TableHead>Required (%)</TableHead>
              <TableHead>Required Score (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </div>
    </div>
  );
}
