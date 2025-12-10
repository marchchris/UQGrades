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
  const [remainingWeight, setRemainingWeight] = useState<number>(1);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  // grade percentage cutoffs
  const [cutOffs, setCutOffs] = useState<number[]>([0, 30, 45, 50, 65, 75, 85]);

  // rounds num to 2 decimal places
  function normalise(num: number): number {
    return Math.round(num * 100) / 100;
  }

  // clamp num to above 0
  // returns infinity if num is infinite
  function clamp(num: number): number {
    if (num === Infinity) {
      return Infinity;
    }
    return Math.max(num, 0);
  }

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
    if (input === "") return -0.01;

    if (value.endsWith("%")) {
      // "70%" → 0.7
      const num = parseFloat(value.slice(0, -1));
      return normalise(num / 100);
    } else if (value.includes("/")) {
      // "7/10" → 0.7
      const [numerator, denominator] = value.split("/").map(Number);
      return normalise(numerator / denominator);
    } else {
      // "70" → 0.7
      const num = parseFloat(value);
      return normalise(num / 100);
    }
  }

  // add assessment object to array
  function addAssessment(id: string, weighting: string) {
    setAssessments((prev) => [
      ...prev,
      {
        id: id,
        weighting: weighting,
        value: -1,
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
    let currScore = 0;
    let currRemainingWeight = 1;

    assessments.forEach((assessment) => {
      // dont count this assessment as its empty
      if (assessment.value == -1) {
        return;
      }

      const weight = parseWeighting(assessment.weighting);

      currScore += weight * assessment.value;
      currScore = normalise(currScore);

      currRemainingWeight -= weight;
      currRemainingWeight = normalise(currRemainingWeight);
    });

    setScore(currScore);
    setRemainingWeight(currRemainingWeight);
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
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="flex flex-col gap-6 max-w-xl">
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

        <div className="flex flex-col gap-3">
          <div className="bg-card p-2 rounded-md w-full border">
            <Table className="text-center">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead className="text-center">Cutoff (%)</TableHead>
                  <TableHead className="text-center">Required (%)</TableHead>
                  <TableHead className="text-center">
                    Required Score (%)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cutOffs.map((cutOff, index) => (
                  <TableRow
                    key={cutOff}
                    className={`
                    ${
                      clamp(normalise((cutOff - score) / remainingWeight)) > 100
                        ? "bg-[#f85149]"
                        : clamp(
                              normalise((cutOff - score) / remainingWeight),
                            ) <= 0
                          ? "bg-[#2ea043]"
                          : ""
                    }`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{cutOff}</TableCell>
                    <TableCell>
                      {clamp(normalise((cutOff - score) / remainingWeight))}
                    </TableCell>
                    <TableCell>
                      {clamp(normalise(cutOff - score))} /{" "}
                      {clamp(normalise(remainingWeight * 100))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center items-center gap-3">
            <div className="flex flex-row gap-1 items-center">
              {" "}
              <div className="w-3 h-3 rounded-full bg-[#2ea043]"></div>
              <span className="text-xs">Guranteed</span>{" "}
            </div>

            <div className="flex flex-row gap-1 items-center">
              <div className="w-3 h-3 rounded-full bg-[#f85149]"></div>
              <span className="text-xs">Impossible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
