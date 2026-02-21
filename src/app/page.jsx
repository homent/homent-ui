"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  FileText,
  Calculator,
  Truck,
  Scale,
  Home,
} from "lucide-react";
import SiteHeader from "./components/SiteHeader";

export default function HomePage() {
  const router = useRouter();

  // Redirect to properties page by default
  useEffect(() => {
    router.replace('/properties');
  }, [router]);

  return (
    <div className="min-h-screen page-background-color flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-custom mb-4"></div>
        <p className="text-gray-600">Redirecting to Properties...</p>
      </div>
    </div>
  );
}
