"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function DoctorPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/doctor/overview");
  }, [router]);

  return <LoadingSpinner />;
}
