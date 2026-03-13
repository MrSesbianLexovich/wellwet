import { LoaderCircle } from "lucide-react";

export default function CustomLoader() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="animate-spin">
        <LoaderCircle />
      </div>
    </div>
  );
}
