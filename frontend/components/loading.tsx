import { Spinner } from "@/components/ui/spinner";

export function LoadingPage() {
  return (
    <div className="flex flex-col w-screen h-ful justify-center items-center">
      <Spinner />
      <h1>Fetching Courses...</h1>
    </div>
  );
}
