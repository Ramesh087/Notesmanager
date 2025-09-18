"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

type RegisterFormInputs = {
  username: string;
  email: string;
  fullname: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const router = useRouter();
  const { isLoggedIn, login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>();
  const password = watch("password");

 
  useEffect(() => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    const mediumPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (strongPattern.test(password)) {
      setPasswordStrength("Strong");
    } else if (mediumPattern.test(password)) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Weak");
    }
  }, [password]);

  
  useEffect(() => {
    if (isLoggedIn) router.push("/");
  }, [isLoggedIn, router]);

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setError(null);

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: data.username,
        email: data.email,
        fullname: data.fullname,
        password: data.password,
      };

      const response = await axios.post("/api/auth/register", payload, {
        withCredentials: true,
      });

      if (response.status === 201) {
        login();
        try { await axios.post("/api/auth/refresh", {}, { withCredentials: true }); } catch {}
        router.push("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white -mt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">Username</label>
            <input
              id="username"
              type="text"
              placeholder="your username"
              {...register("username", { required: "Username is required" })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullname" className="block mb-1 font-medium">Full Name</label>
            <input
              id="fullname"
              type="text"
              placeholder="John Doe"
              {...register("fullname", { required: "Full name is required" })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                  message: "Password must include uppercase, lowercase, number & special character"
                }
              })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

            {password && (
              <p className={`mt-1 text-sm ${
                passwordStrength === "Strong" ? "text-green-500" :
                passwordStrength === "Medium" ? "text-yellow-400" :
                "text-red-500"
              }`}>
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", { required: "Please confirm password" })}
              className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
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
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-red-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
