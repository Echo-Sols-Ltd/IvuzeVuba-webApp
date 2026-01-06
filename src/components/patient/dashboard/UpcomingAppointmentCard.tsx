import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Appointment {
  id: string;
  departmentName: string;
  reason: string;
  preferredDate: string;
  status: string;
  doctorName?: string;
  assignedDoctorName?: string;
  scheduledTime?: string;
}

interface UpcomingAppointmentCardProps {
  appointments: Appointment[];
}

export const UpcomingAppointmentCard = ({ appointments }: UpcomingAppointmentCardProps) => {
  // Get the next upcoming appointment
  const upcomingAppointment = appointments.find(apt => 
    apt.status === 'SCHEDULED' || apt.status === 'IN_QUEUE'
  ) || appointments[0];

  if (!upcomingAppointment) {
    return (
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming appointment</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No upcoming appointments</p>
          <Link href="/patient/visits/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Create new appointment
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const appointmentDate = upcomingAppointment.scheduledTime 
    ? new Date(upcomingAppointment.scheduledTime).toLocaleDateString()
    : upcomingAppointment.preferredDate 
      ? new Date(upcomingAppointment.preferredDate).toLocaleDateString()
      : 'Date TBD';

  const doctorName = upcomingAppointment.doctorName || upcomingAppointment.assignedDoctorName || 'Not assigned yet';

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming appointment</h3>
      <div className="space-y-3 mb-4">
        <div>
          <p className="font-medium text-gray-900">Hospital</p>
          <p className="text-sm text-gray-600">{appointmentDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Department:</span> {upcomingAppointment.departmentName || 'General'}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Doctor Name:</span> {doctorName}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Reason:</span> {upcomingAppointment.reason || 'General consultation'}
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
};
