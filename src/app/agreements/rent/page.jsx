"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function RentAgreementsList() {
  const [agreements, setAgreements] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("agreements") || "[]");
      setAgreements(Array.isArray(stored) ? stored : []);
    } catch (e) {
      setAgreements([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Rental Agreements" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Rental Agreements</h1>
          <p className="text-sm text-gray-600">Manage agreements and view broker-only contact details.</p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {agreements.length === 0 ? (
                <div className="bg-white p-6 rounded shadow-sm text-gray-600">No agreements created yet (demo).</div>
              ) : (
                agreements.map((a) => (
                  <Link to={`/agreements/rent/${a.id}`} key={a.id} className="block bg-white p-4 rounded shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-semibold">{a.tenant} ↔ {a.landlord}</div>
                        <div className="text-sm text-gray-600">Rent: ₹{a.rent} • Duration: {a.agreementDurationMonths || '-'} months</div>
                      </div>
                      <div className="text-sm text-gray-500">{new Date(a.createdAt || a.created_at || Date.now()).toLocaleDateString()}</div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Actions</h3>
              <Link to="/movers/create-agreement" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg mb-3">Create Agreement</Link>
              {/* <Link to="/movers/providers" className="block w-full text-center px-4 py-2 border rounded-lg">Find Packers & Movers</Link> */}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
