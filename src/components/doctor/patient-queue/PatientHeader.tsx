"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PatientHeader() {
  const router = useRouter();
  const handleClick = () => {
    router.back();
  };
  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={handleClick} />
        <div>
          <h1 className="font-semibold">Patient Chart</h1>
          <p className="text-sm text-gray-500">#APT12345</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Save Draft
        </Button>
        <Button variant="outline" size="sm">
          Sign &amp; Submit
        </Button>
        <Button variant="outline" size="sm">
          Transfer
        </Button>
        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
          Complete visit
        </Button>
      </div>
    </div>
  );
}
