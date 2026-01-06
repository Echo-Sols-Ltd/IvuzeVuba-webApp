import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Visit {
  id: string;
  hospital: string;
  date: string;
  department?: string;
  doctor?: string;
  status: "waiting" | "completed" | "canceled";
}

interface RecentVisitsCardProps {
  visits: Visit[];
}

export const RecentVisitsCard = ({ visits }: RecentVisitsCardProps) => (
  <div className="bg-white rounded-lg border p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Recent Visits</h3>
        <p className="text-sm text-gray-600">
          Here are your recent healthcare visits.
        </p>
      </div>
      <Link
        href="/patient/visits"
        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 hover:underline"
      >
        View more
      </Link>
    </div>

    <div className="space-y-4">
      {visits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No recent visits found</p>
          <Link href="/patient/visits/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Schedule your first appointment
            </Button>
          </Link>
        </div>
      ) : (
        visits.map((visit, index) => (
          <div key={visit.id || `visit-${index}`} className="p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{visit.hospital}</p>
                {visit.department && visit.doctor && (
                  <p className="text-sm text-gray-600">
                    {visit.department} • {visit.doctor}
                  </p>
                )}
                <p className="text-sm text-gray-500">{visit.date}</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Badge
                  className={`${
                    visit.status === "waiting"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : visit.status === "completed"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-red-100 text-red-800 border-red-200"
                  } px-3 py-1 rounded-full text-sm font-medium w-fit transition-all duration-200`}
                >
                  {visit.status}
                </Badge>
                <Link href="/patient/visits">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full sm:w-auto transition-all duration-300 hover:scale-105"
                  >
                    View details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
