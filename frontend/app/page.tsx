"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { CodeCombobox } from "@/components/course-combobox";
import { LoadingPage } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  // course codes combobox variables
  const [value, setValue] = useState("");
  const [codes, setCodes] = useState(null);

  // form selection variables
  const [semester, setSemester] = useState<string>("1");
  const [year, setYear] = useState<string>("");
  const [canUseBtn, setCanUseBtn] = useState<boolean>(false);

  const isValidYear =
    year.length === 4 && !isNaN(year) && year >= 2000 && year <= 2100;

  // page state variables
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // fetch course codes from backend api
  useEffect(() => {
    console.log(process.env.BASE_URL);
    const fetchCodes = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/codes`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const json = await response.json();
        setCodes(json);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  // ensure form is filled before pressing button
  useEffect(() => {
    if (value === "") {
      setCanUseBtn(false);
      return;
    }

    if (semester === "") {
      setCanUseBtn(false);
      return;
    }

    if (year === "" || !isValidYear) {
      setCanUseBtn(false);
      return;
    }

    setCanUseBtn(true);
  }, [value, semester, year]);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col gap-6 items-center">
          <div className="text-center">
            <h1 className="text-lg font-bold">UQ Grades</h1>
            <p className="text-sm text-neutral-400">
              Select course code, year and semester to start.
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
              <Label htmlFor="courseSelect">Course Code</Label>
              <CodeCombobox
                id="courseSelect"
                value={value}
                setValue={setValue}
                codes={codes}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="semesterSelect">Semester</Label>
              <Select
                id="semesterSelect"
                value={semester}
                onValueChange={(value) => {
                  setSemester(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">Semester 1</SelectItem>
                    <SelectItem value="2">Semester 2</SelectItem>
                    <SelectItem value="3">Summer Semester</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="yearSelect">Year</Label>
              <Input
                id="yearSelect"
                type="number"
                min="1"
                max="9999"
                maxLength="4"
                placeholder="Select year... (e.g 2025)"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
              <div className="flex flex-col items-center">
                {year && !isValidYear && (
                  <span className="text-red-400 text-sm">
                    Enter a valid year
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-full">
            <Button
              className="w-1/2"
              disabled={!canUseBtn}
              onClick={() => router.push(`/${value}/${year}/${semester}`)}
            >
              Find Course
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
