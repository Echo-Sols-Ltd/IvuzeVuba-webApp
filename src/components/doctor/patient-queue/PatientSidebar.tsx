import Image from "next/image";

export default function PatientSidebar() {
  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="text-center">
        <Image
          src="/man.png"
          alt="Patient"
          width={96}
          height={96}
          className="rounded-full mx-auto"
        />
        <h2 className="font-semibold mt-2">Sarah Johnson</h2>
        <p className="text-sm text-gray-500">#APT12345</p>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-medium mb-2">Contact Information</h3>
        <p className="text-sm">Phone: +250 788 567 999</p>
        <p className="text-sm">Service Date: 2024-01-15</p>
        <p className="text-sm">Address: Kigali, Rwanda</p>
      </div>

      {/* Recent Visits */}
      <div>
        <h3 className="font-medium mb-2">Recent Visits</h3>
        <p className="text-sm">Service Date: 2024-01-15</p>
        <p className="text-sm">Reason: Annual Checkup</p>
      </div>
    </div>
  );
}
