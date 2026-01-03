"use client";

import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";

export default function SiteHeader({ title, Icon }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRole = localStorage.getItem("user_role") === "broker";
  const menuRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/partner/login";
  };

  const pages = [
    { to: "/", label: "Home" },
    { to:"/properties/new", label:"Post Your Property"},
    { to: "/properties", label: "Properties" },
    { to: "/property-transfer/create-property-transfer", label: "Create Property Transfer" },
    { to: "/property-transfer", label: "View Property Transfers List" },
    { to: "/movers", label: "Request Packers & Movers" },
    { to: "/movers/providers", label: "View Movers Providers User" },
    { to: "/movers/create-agreement", label: "Create Rental Agreement" },
    { to: "/agreements/rent", label: "View Rental Agreements User" },
    { to: "/legal", label: "Request Legal Services" },
  
  ];

  return (
    <>
      <header className="fixed top-0 w-full text-white bg-blue-600 border-b shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              {Icon && <Icon className="h-8 w-8 text-white-600" />}
              <span className="text-xl font-bold text-white-900">
                EstateHubster
              </span>
              {title && (
                <span className="hidden sm:block text-md text-white-700">
                  {title}
                </span>
              )}
            </div>

            {/* Right Section */}
            {userRole ? (
              <div
                className="flex items-center gap-3 relative"
                ref={menuRef}
              >
                {/* USER DROPDOWN */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((s) => !s)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:text-black hover:bg-gray-100"
                  >
                    <User className="h-5 w-5 text-white-700" />
                    <span className="hidden sm:block text-md text-white-900">
                      Sandhya
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                      <ul className="py-1 text-sm text-gray-700">
                        <li>
                          <Link
                            to="/partner/edit-profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 hover:bg-gray-50"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/properties"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 hover:bg-gray-50"
                          >
                            My Dashboard
                          </Link>
                        </li>
                        <li className="border-t">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* MENU BUTTON */}
                <button
                  onClick={() => setOpen((s) => !s)}
                  className="p-2 rounded-md hover:bg-gray-50 hover:text-black flex items-center gap-2"
                >
                  <Menu className="h-5 w-5" />
                  <span className="hidden sm:block text-md text-white-900">
                    Menu
                  </span>
                </button>

                {/* MAIN MENU */}
                {open && (
                  <nav className="absolute right-0 top-14 w-64 bg-white border rounded-md shadow-lg z-40">
                    <div className="p-3">
                      <div className="text-sm text-gray-600 mb-2">
                        Navigate
                      </div>
                      <ul className="divide-y">
                        {pages.map((p) => (
                          <li key={p.to}>
                            <Link
                              to={p.to}
                              onClick={() => setOpen(false)}
                              className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            >
                              {p.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                )}
              </div>
            ) : (
              <nav className="flex items-center gap-3">
                <a
                  href="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Home
                </a>
                <a
                  href="/partner/login"
                  className="hidden sm:block text-gray-700 border border-blue-600 px-4 py-2 rounded-lg hover:text-white hover:bg-blue-700"
                >
                  Login
                </a>
                <a
                  href="/partner/register"
                  className="hidden sm:block text-gray-700 border border-blue-600 px-4 py-2 rounded-lg hover:text-white hover:bg-blue-700"
                >
                  Signup Now
                </a>
              </nav>
            )}
          </div>
        </div>
      </header>
      <div className="h-16" />
    </>
  );
}
