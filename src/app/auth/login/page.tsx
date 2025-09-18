"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type LoginFormInputs = {
  identifier: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

 
  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setError(null);

    try {
      const payload = data.identifier.includes("@")
        ? { email: data.identifier, password: data.password }
        : { username: data.identifier, password: data.password };

      const response = await axios.post("/api/auth/login", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        }, 
      });

      if (response.status === 200) {
        login();
        
        try { await axios.post("/api/auth/refresh", {}, { withCredentials: true }); } catch {}
        router.push("/");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white -mt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Identifier */}
          <div>
            <label htmlFor="identifier" className="block mb-1 font-medium">
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="you@example.com or username"
              {...register("identifier", { required: "Email or username is required" })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Error message */}
          {error && (
            <p className="text-red-500 text-sm text-center bg-red-900/30 p-2 rounded-md">
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 disabled:bg-red-800 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-red-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
