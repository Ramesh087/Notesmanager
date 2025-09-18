"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Note = {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
};

export default function NotesPage() {
  const router = useRouter();
  const { isLoggedIn, isAdmin } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authResolved, setAuthResolved] = useState(false); 


  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace("/auth/login");
    } else if (isLoggedIn === true) {
      setAuthResolved(true);
    }
  }, [isLoggedIn, router]);

 
  useEffect(() => {
    if (!authResolved) return;

    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/notes", { withCredentials: true });
        const list = res.data?.data?.notes ?? res.data?.notes ?? [];
        setNotes(list);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [authResolved]);

  if (!authResolved) return null; 

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`/api/notes/${id}`, { withCredentials: true });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div className="p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Your Notes</h1>
        <button
          className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700"
          onClick={() => router.push("/notes/form")}
        >
          Create New Note
        </button>
      </div>

      {loading && <p className="text-white">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note._id} className="bg-gray-800 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-white">{note.title}</h2>
            <p className="text-gray-300 mt-2">{note.description}</p>
            <div className="flex justify-end gap-2 mt-4">
              {!isAdmin && (
                <button
                  className="px-2 py-1 bg-yellow-500 rounded-md text-black hover:bg-yellow-600"
                  onClick={() => router.push(`/notes/form?id=${note._id}`)}
                >
                  Edit
                </button>
              )}
              <button
                className="px-2 py-1 bg-red-600 rounded-md text-white hover:bg-red-700"
                onClick={() => handleDelete(note._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && !loading && (
        <p className="text-gray-400 mt-4">No notes found. Create your first note!</p>
      )}
    </div>
  );
}
