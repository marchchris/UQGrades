"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { LoadingPage } from "@/components/loading";
import { Error } from "@/components/error";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Assessment {
  id: string;
  weighting: string;
  value: number;
}

export default function Calculator() {
  const params = useParams();
  const router = useRouter();

  const courseCode = params.code;
  const year = params.year;
  const semester = params.semester;

  const [courseData, setCourseData] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<>(null);

  const [score, setScore] = useState<number>(0);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  // checks if score in input field matches correct pattern
  function isValidScore(input: string): boolean {
    // Trim whitespace
    const value = input.trim();

    // Matches:
    // 1. 0-100 (integer)
    // 2. 0-100% (integer + %)
    // 3. n/m where n,m are numbers, m != 0
    const regex = /^(\d{1,3}%?|\d+\/\d+)$/;

    // empty input
    if (input === "") return true;

    if (!regex.test(value)) return false;

    if (value.endsWith("%")) {
      const num = parseInt(value.slice(0, -1), 10);
      return num >= 0 && num <= 100;
    } else if (value.includes("/")) {
      const [numerator, denominator] = value.split("/").map(Number);
      return denominator !== 0 && numerator >= 0 && numerator <= denominator;
    } else {
      const num = parseInt(value, 10);
      return num >= 0 && num <= 100;
    }
  }

  // converts any format of number into decimal value
  function parseWeighting(input: string): number {
    const value = input.trim();

    // empty input
    if (input === "") return 0;

    if (value.endsWith("%")) {
      // "70%" → 0.7
      const num = parseFloat(value.slice(0, -1));
      return num / 100;
    } else if (value.includes("/")) {
      // "7/10" → 0.7
      const [numerator, denominator] = value.split("/").map(Number);
      return numerator / denominator;
    } else {
      // "70" → 0.7
      const num = parseFloat(value);
      return num / 100;
    }
  }

  // add assessment object to array
  function addAssessment(id: string, weighting: string) {
    setAssessments((prev) => [
      ...prev,
      {
        id: id,
        weighting: weighting,
        value: 0,
      },
    ]);
  }

  // update assessment object in array by id
  function updateAssessments(id: string, key: keyof Assessment, value: number) {
    if (!isValidScore(value)) {
      return;
    }

    const score = parseWeighting(value) * 100;

    setAssessments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ["value"]: score } : item,
      ),
    );
  }

  // update total score when inputs change
  useEffect(() => {
    let score = 0;
    assessments.forEach((assessment) => {
      score = score + parseWeighting(assessment.weighting) * assessment.value;
    });

    setScore(score);
  }, [assessments]);

  // fetch and retrieve course data from api
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

        const parsedJSON = JSON.parse(jsonData.data);
        setAssessmentData(parsedJSON);

        // add each assessment item to array
        for (const key in parsedJSON) {
          addAssessment(key, parsedJSON[key]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  // display loading page if still fetching
  if (loading) {
    return <LoadingPage />;
  }

  // display error message if course offering does not exist
  if (error) {
    return (
      <div>
        <div className="flex flex-col h-screen justify-center items-center">
          <div className="w-full max-w-xl flex flex-col items-center gap-4">
            <Error code={courseCode} year={year} semester={semester}></Error>
            <Button onClick={() => router.push("/")}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="flex flex-col gap-6">
        <div className="bg-card p-2 rounded-md w-full border">
          <h1 className="text-xl text-center">
            {courseCode} -{" "}
            {semester != 3 ? (
              <span>Semester {semester}</span>
            ) : (
              <span>Summer Semester</span>
            )}{" "}
            {year}
          </h1>
        </div>
        <div className="bg-card p-2 rounded-md w-full border">
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
                    <Input
                      onChange={(e) =>
                        updateAssessments(
                          key,
                          assessmentData[key],
                          e.target.value,
                        )
                      }
                      placeholder="70, 70%, 7/10"
                    ></Input>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="bg-card p-2 rounded-md w-full border">
          <h1 className="text-xl text-center">Total Score: {score}%</h1>
        </div>

        <div className="bg-card p-2 rounded-md w-full border">
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
    </div>
  );
}
