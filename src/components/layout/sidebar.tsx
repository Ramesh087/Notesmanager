"use client";

import Link from "next/link";
import { FC } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100%-4rem)] bg-gray-100 dark:bg-gray-800 p-4 transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 z-40 shadow-lg`}
      aria-hidden={!isOpen}
    >
      <button onClick={onClose} className="mb-4 md:hidden px-2 py-1 border rounded">
        Close
      </button>
      <nav className="flex flex-col gap-2 space-y-2">
        
      <Link href="/">
          <button className="px-4 py-2 border rounded w-full justify-center">
            Home
          </button>
        </Link>
        {/* <Link href="auth/change-password">
          <button className="px-4 py-2 border rounded w-full justify-center">
            Change Password
          </button>
        </Link> */}
        <div className="px-4 py-2 flex justify-center border rounded">
    <button className=" opacity-50 cursor-not-allowed">
      Settings(Coming Soon)
    </button>
    </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
