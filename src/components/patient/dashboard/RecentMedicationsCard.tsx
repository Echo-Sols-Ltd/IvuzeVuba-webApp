import Link from "next/link";

export const RecentMedicationsCard = () => (
  <div className="bg-white rounded-lg border p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Recent medications</h3>
        <p className="text-sm text-gray-600">Here are your recent medications.</p>
      </div>
      <Link 
        href="/patient/prescriptions" 
        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200 hover:underline"
      >
        View more
      </Link>
    </div>
    <div className="text-center py-8">
      <p className="text-gray-500 text-sm">No recent medications</p>
    </div>
  </div>
);
