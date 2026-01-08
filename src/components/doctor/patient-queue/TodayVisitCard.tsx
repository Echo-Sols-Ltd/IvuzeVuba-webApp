export default function TodayVisitCard() {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 w-80">
      <h3 className="font-semibold mb-3">Today&apos;s Visit</h3>
      <p className="text-sm">
        <span className="font-medium">Description</span>: Chest pain and shortness of breath
      </p>
      <p className="text-sm mt-2">
        <span className="font-medium">Triage level</span>: 
        <span className="text-red-600 ml-1">Urgent</span>
      </p>
      <p className="text-sm mt-2">
        <span className="font-medium">Wait time</span>: 30 mins
      </p>
    </div>
  );
}
