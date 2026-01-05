import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UpcomingAppointmentCardProps {
  hospital: string;
  date: string;
  department: string;
  doctor: string;
}

export const UpcomingAppointmentCard = ({ hospital, date, department, doctor }: UpcomingAppointmentCardProps) => (
  <div className="bg-white rounded-lg border p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming appointment</h3>
    <div className="space-y-3 mb-4">
      <div>
        <p className="font-medium text-gray-900">{hospital}</p>
        <p className="text-sm text-gray-600">{date}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Department:</span> {department}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Doctor Name:</span> {doctor}
        </p>
      </div>
    </div>
    <Link href="/patient/visits/create">
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Create new appointment
      </Button>
    </Link>
  </div>
);
