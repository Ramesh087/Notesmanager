"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import Header from "./header";
import Sidebar from "./sidebar";



export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();


 

  const noLayoutPages = ["/auth/login", "/auth/register"];
  const hideLayout = noLayoutPages.includes(pathname);

  const closeSidebar = () => setSidebarOpen(false);
  // const openSidebar = () => setSidebarOpen(true);
 

  useEffect(() => setIsMounted(true), []);

  return (
    <AuthProvider>
      {!hideLayout && <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />}
      <div className="flex min-h-screen pt-16">
        {!hideLayout && isMounted && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
        )}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </AuthProvider>
  );
}
