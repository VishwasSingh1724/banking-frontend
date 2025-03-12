"use client"; // Ensure this is a Client Component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(localStorage.getItem("token")); // Read token only on the client
  }, []);

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    router.push("/pages/login");
  };

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
      <div className="text-xl font-bold text-gray-900 cursor-pointer z-50">
        <Link href="/">ModernBank</Link>
      </div>

      {/* Render button only after token is checked */}
      {token !== null && (
        <button
          className="text-sm px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          onClick={() => (token ? Logout() : router.push("/pages/login"))}
        >
          {token ? "Logout" : "Login"}
        </button>
      )}
    </header>
  );
}
