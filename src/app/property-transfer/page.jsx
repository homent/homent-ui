"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function PropertyTransferList() {
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("property_transfers") || "[]"
      );
      setTransfers(Array.isArray(stored) ? stored : []);
    } catch {
      setTransfers([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Property Transfers" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LIST */}
          <div className="lg:col-span-2 space-y-4">
            {transfers.length === 0 ? (
              <div className="bg-white p-6 rounded shadow-sm text-gray-600">
                No property transfers recorded.
              </div>
            ) : (
              transfers.map((t) => (
                <Link
                  key={t.id}
                  to={`/property-transfer/${t.id}`}
                  className="block bg-white p-4 rounded shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">
                        {t.propertyTitle}
                      </div>
                      <div className="text-sm text-gray-600">
                        Buyer: {t.buyerName} • Seller: {t.sellerName}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* ACTIONS */}
          <aside>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Actions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Record a new property transfer for testing.
              </p>
              <Link
                to="/property-transfer/create-property-transfer"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Create Property Transfer
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
