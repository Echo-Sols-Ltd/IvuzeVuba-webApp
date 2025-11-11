import PatientCard from "./PatientCard";

/**
 * @interface QueuePatient
 * @description Type definition for patient queue data
 */
interface QueuePatient {
  id: string;
  name: string;
  description: string;
  serviceDate: string;
  imageUrl: string;
  urgent: boolean;
}

/**
 * @component PatientQueueList
 * @description Displays a list of patients in the queue
 * @todo Implement real-time updates for queue positions
 */
export default function PatientQueueList({
  search,
  selectedDate,
}: {
  search?: string;
  selectedDate?: Date;
}) {
  // Convert mock data to match QueuePatient interface
  const patients: QueuePatient[] = [
    {
      id: "apt23056",
      name: "James Bond",
      description: "Chest pain",
      serviceDate: "2025-08-24",
      imageUrl: "https://i.pravatar.cc/150?img=12",
      urgent: true,
    },
    {
      id: "apt39244",
      name: "Tyres Gibson",
      description: "Headache",
      serviceDate: "2025-08-25",
      imageUrl: "https://i.pravatar.cc/150?img=33",
      urgent: false,
    },
    {
      id: "apt23057",
      name: "Jonathan Kuminga",
      description: "Fever",
      serviceDate: "2025-08-24",
      imageUrl: "https://i.pravatar.cc/150?img=51",
      urgent: true,
    },
  ];

  // Filter patients
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesDate =
      !selectedDate ||
      new Date(p.serviceDate).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Today</h3>
      {filteredPatients.length > 0 ? (
        filteredPatients.map((patient, idx) => (
          <PatientCard key={idx} patient={{ ...patient, image: patient.imageUrl }} />
        ))
      ) : (
        <p className="text-gray-500">No patients match your filters.</p>
      )}
    </div>
  );
}
