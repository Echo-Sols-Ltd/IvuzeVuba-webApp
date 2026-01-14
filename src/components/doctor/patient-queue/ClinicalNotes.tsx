"use client";

import { useState, useEffect } from "react";
import { API_ENDPOINTS, getAuthHeaders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ClinicalNote {
  id?: string;
  title?: string;
  content: string;
  createdAt: string;
  noteType?: string;
}

interface ClinicalNotesProps {
  appointmentId: string;
}

export default function ClinicalNotes({ appointmentId }: ClinicalNotesProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [existingNotes, setExistingNotes] = useState<ClinicalNote[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (appointmentId) {
      fetchExistingNotes();
    }
  }, [appointmentId]);

  const fetchExistingNotes = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/chart/clinical-notes/${appointmentId}`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setExistingNotes(data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSave = async () => {
    if (!notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter some notes before saving",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.DOCTOR.BASE}/chart/clinical-notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          appointmentId,
          content: notes,
          noteType: "CLINICAL",
          title: "Clinical Note",
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Clinical notes saved successfully!",
        });
        setNotes("");
        fetchExistingNotes(); // Refresh the notes list
      } else {
        const error = await response.text();
        toast({
          title: "Error",
          description: error || "Failed to save clinical notes",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save clinical notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">Clinical Notes</h2>

      {/* Existing Notes */}
      {existingNotes.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Previous Notes</h3>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {existingNotes.map((note, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-700">{note.title || "Clinical Note"}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Note Textarea */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Enter clinical notes ..."
        className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {/* Save Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
