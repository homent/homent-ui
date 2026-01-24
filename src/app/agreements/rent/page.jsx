"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import SiteHeader from "../../components/SiteHeader";

export default function RentAgreementsList() {
  const [agreements, setAgreements] = useState([]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = JSON.parse(
          localStorage.getItem("agreements") || "[]"
        );
        setAgreements(Array.isArray(stored) ? stored : []);
      }
    } catch {
      setAgreements([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Rental Agreements" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LIST */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {agreements.length === 0 ? (
                <div className="bg-white p-6 rounded shadow-sm text-gray-600">
                  No agreements created yet (demo).
                </div>
              ) : (
                agreements.map((a) => (
                  <Link
                    key={a.id}
                    href={`/agreements/rent/${a.id}`}
                    className="block bg-white p-4 rounded shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-semibold">
                          {a.tenant} ↔ {a.landlord}
                        </div>
                        <div className="text-sm text-gray-600">
                          Rent: ₹{a.rent} • Duration:{" "}
                          {a.agreementDurationMonths || "-"} months
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(
                          a.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <aside>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Actions</h3>
              <Link
                href="/movers/create-agreement"
                className="block w-full text-center px-4 py-2 bg-orange-custom text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Agreement
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}