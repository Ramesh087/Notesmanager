"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Header({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { isLoggedIn, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-gray-900 shadow-md flex items-center px-4 justify-between z-50">
        {/* Left - Logo + Sidebar toggle */}
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              aria-label="Toggle sidebar"
              onClick={onToggleSidebar}
              className="px-2 py-1 border rounded"
            >
              Menu
            </button>
          )}
          <div className="text-xl font-bold">NOTOPEDIA</div>
        </div>

        {/* Middle - Search (visible only on desktop) */}
        <div className="hidden md:flex flex-1 justify-center">
          <input
            type="text"
            placeholder="Search notes...(Coming Soon)"
            className="w-full max-w-md px-2 py-1 border rounded-md"
          />
        </div>

        {/* Right - Desktop buttons */}
        <div className="hidden md:block">
          {!isLoggedIn ? (
            <>
              <Link href="/auth/login" className="px-4 py-2 mr-2 border rounded-md">
                Login
              </Link>
              <Link href="/auth/register" className="px-4 py-2 border rounded-md">
                Signup
              </Link>
            </>
          ) : (
            <button onClick={logout} className="px-4 py-2 border rounded-md">
              Logout
            </button>
          )}
        </div>

        <div className="relative md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="px-3 py-2 border rounded-md"
        >
          ☰
        </button>

        {/* Dropdown menu (mobile only) */}
        {mobileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-md shadow-lg p-2 space-y-2 z-50">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            )}

          </div>
        )}
      </div>
      
      </header>
    </>
  );
}
