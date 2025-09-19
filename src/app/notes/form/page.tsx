"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";


type NoteFormInputs = {
  title: string;
  description: string;
  isPublished: boolean;
};

 function NotesFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id"); 

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!noteId);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<NoteFormInputs>({
    defaultValues: { title: "", description: ""},
  });

 
  useEffect(() => {
    if (!noteId) return;

    const fetchNote = async () => {
      setFetching(true);
      try {
        const res = await axios.get(`/api/notes/${noteId}`, { withCredentials: true });
        const note = res?.data?.data ?? res?.data?.note;
        setValue("title", note.title);
        setValue("description", note.description);
        if (note.isPublished !== undefined) setValue("isPublished", note.isPublished);
      } catch (err: unknown) {
  if (err && typeof err === "object" && "response" in err) {
    const axiosErr = err as { response?: { data?: { message?: string } } };
    setError(axiosErr.response?.data?.message || "Failed to load note");
  } else if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to load note");
  }
} finally {
        setFetching(false);
      }
    };

    fetchNote();
  }, [noteId, setValue]);

  const onSubmit = async (data: NoteFormInputs) => {
    setLoading(true);
    setError(null);
    try {
      if (noteId) {
        
        await axios.put(`/api/notes/${noteId}`, data, { withCredentials: true });
      } else {
       
        await axios.post("/api/notes", data, { withCredentials: true });
      }
      router.push("/");
    } catch (err: unknown) {
  if (err instanceof AxiosError) {
    if (err.response?.status === 401) {
      router.push("/auth/login");
    } else {
      setError(err.response?.data?.message || "Failed to load note");
    }
  } else if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to load note");
  }
} finally {
  setLoading(false);
}
  };

  if (fetching) return <p className="text-white p-4">Loading note...</p>;

  return (
      
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white -mt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">{noteId ? "Edit Note" : "Create Note"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">Title</label>
            <input
              id="title"
              type="text"
              {...register("title", { required: "Title is required" })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-1 font-medium">Description</label>
            <textarea
              id="description"
              {...register("description", { required: "Description is required" })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

         
          

          {/* Error */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 disabled:bg-red-800 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : noteId ? "Update Note" : "Create Note"}
          </button>
        </form>
      </div>
    </div>
    
  );
}


export default function NotesFormPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotesFormContent />
    </Suspense>
  )
}
