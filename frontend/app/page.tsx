"use client";

import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { CodeCombobox } from "@/components/course-combobox";
import { LoadingPage } from "@/components/loading";

export default function Home() {
  // course codes combobox variables
  const [value, setValue] = useState("");
  const [codes, setCodes] = useState(null);

  // page state variables
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/codes");
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

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col text-center gap-4">
          <div>
            <h1 className="text-lg font-bold">UQ Grades</h1>
            <p className="text-sm text-neutral-400">
              Select course code, year and semester to start.
            </p>
          </div>
          <div>
            <CodeCombobox value={value} setValue={setValue} codes={codes} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
