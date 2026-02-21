"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import SiteHeader from "../../components/SiteHeader";

export default function PropertyTransferDetail() {
  const router = useRouter();
  const [transfer, setTransfer] = useState(null);
  const [isBroker, setIsBroker] = useState(false);

  useEffect(() => {
    try {
      const role = localStorage.getItem("role");
      setIsBroker(role === "broker");

      const stored = JSON.parse(
        localStorage.getItem("property_transfers") || "[]"
      );

      // pick latest or first record
      setTransfer(stored[0] ?? null);
    } catch {
      setTransfer(null);
    }
  }, []);

  if (!transfer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Transfer record not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Property Transfer" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">Property Transfer</h1>
                <button
                  onClick={() => router.back()}
                  className="text-sm text-blue-600"
                >
                  Back
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="font-medium">
                    {transfer.propertyTitle || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seller</p>
                  <p className="font-medium">
                    {transfer.sellerName || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Buyer</p>
                  <p className="font-medium">
                    {transfer.buyerName || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-3">Transfer Details</h3>

              {isBroker ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    Seller Phone:{" "}
                    <span className="font-medium">
                      {transfer.sellerPhone || "N/A"}
                    </span>
                  </div>
                  <div>
                    Buyer Phone:{" "}
                    <span className="font-medium">
                      {transfer.buyerPhone || "N/A"}
                    </span>
                  </div>
                  <div>
                    Documents:{" "}
                    <span className="font-medium">
                      {transfer.documents?.join(", ") || "N/A"}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Full transfer details are visible to verified brokers only.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}