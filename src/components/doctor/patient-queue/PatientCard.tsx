import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    description: string;
    serviceDate: string;
    urgent: boolean;
    image: string;
  };
}

export default function PatientCard({ patient }: PatientCardProps) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm flex items-start justify-between">
      {/* Patient Info */}
      <div className="flex items-start gap-3">
        <Image
          src={patient.image || "/placeholder-avatar.png"}
          alt="Patient Avatar"
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <p className="font-medium">{patient.name}</p>
          <p className="text-sm text-gray-500">ID: #{patient.id}</p>
          <p className="text-sm text-gray-700">
            Description: {patient.description}
          </p>
          <p className="text-sm text-gray-500">
            Service Date: {patient.serviceDate}
          </p>
          {patient.urgent && (
            <span className="mt-1 inline-block bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded">
              urgent
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Link href={`/doctor/patients/${patient.id}`} className="block w-full">
          <Button variant="outline" size="sm">
            Open Chart
          </Button>
        </Link>
        <Button
          className="bg-[#616161] text-white hover:bg-opacity-80"
          size="sm"
        >
          Start Consultation
        </Button>
        <Button variant="outline" size="sm">
          Refer
        </Button>
      </div>
    </div>
  );
}
