"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, User } from "lucide-react";

export default function SiteHeader({ title, Icon }) {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserRole(localStorage.getItem("user_role") === "broker");
    }

    const onDocClick = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/partner/login";
  };

  const pages = [
    { to: "/", label: "Home" },
    { to: "/properties/new", label: "Post Your Property" },
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
      <header className="fixed top-0 w-full bg-orange-custom border-b shadow-sm z-50 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-2">
              {Icon && 
              // <Icon className="h-8 w-8" />
              <img src="/images/logo_homent.png" color="white" alt="Homent Logo" className="h-8 w-8" />
              
              }
              <span className="text-xl font-bold">Homent</span>
              {title && (
                <span className="hidden sm:block text-md opacity-90">
                  {title}
                </span>
              )}
              {/* <img src="/images/homent_logo.svg" alt="Logo" width="100" height="100"> */}
              {/* </img> */}
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-3 relative" ref={menuRef}>

              {/* USER DROPDOWN (only for broker) */}
              {userRole && (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((s) => !s)}
                    className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white hover:text-black"
                  >
                    <User className="h-5 w-5" />
                    <span className="hidden sm:block text-md">
                      Sandhya
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                      <ul className="py-1 text-sm text-gray-700">
                        <li>
                          <Link
                            href="/partner/edit-profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 hover:bg-gray-50"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/properties"
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
              )}

              {/* GUEST ACTIONS */}
              { userRole == false  && (
                <nav className="flex items-center gap-3">
                <a
                  href="/"
                  className="hidden sm:block text-white-700 border btn-border-color px-4 py-2 rounded-lg hover:text-black hover:bg-white"
                >
                  Home
                </a>
                <a
                  href="/partner/login"
                  className="hidden sm:block text-white-700 border btn-border-color px-4 py-2 rounded-lg hover:text-black hover:bg-white"
                >
                  Login
                </a>
                <a
                  href="/partner/register"
                  className="hidden sm:block text-white border btn-border-color px-4 py-2 rounded-lg hover:text-black hover:bg-white"
                >
                  Signup Now
                </a>
              </nav>
              )}

              {/* MENU BUTTON (for ALL users) */}
              <button
                onClick={() => setOpen((s) => !s)}
                className="p-2 rounded-md hover:bg-white hover:text-black flex items-center gap-2"
              >
                <Menu className="h-5 w-5" />
                <span className="hidden sm:block text-md">
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
                            href={p.to}
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
          </div>
        </div>
      </header>

      {/* HEADER SPACER */}
      <div className="h-16" />
    </>
  );
}
