import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ErrorAlert({ code, year, semester }) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>
        {code.toUpperCase()},{" "}
        {semester == 3 ? (
          <span>Summer Semester</span>
        ) : (
          <span>Semester {semester}</span>
        )}{" "}
        {year}.
      </AlertTitle>
      <AlertDescription>
        <p>
          Unable to find course offering. Please check the course code, year,
          and semester are correct.
        </p>
      </AlertDescription>
    </Alert>
  );
}
