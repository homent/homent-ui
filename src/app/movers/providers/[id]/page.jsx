"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import SiteHeader from "../../../components/SiteHeader";

const SAMPLE_PROVIDERS = {
  p1: {
    id: "p1",
    name: "MoveFast Packers",
    rating: 4.6,
    startingPrice: 5000,
    phone: "+91 98100 11111",
    services: ["Packing", "Loading", "Transport", "Unloading"],
  },
  p2: {
    id: "p2",
    name: "SafeShift Movers",
    rating: 4.4,
    startingPrice: 7000,
    phone: "+91 98100 22222",
    services: ["Packing", "Transport", "Insurance"],
  },
  p3: {
    id: "p3",
    name: "QuickLoad Logistics",
    rating: 4.2,
    startingPrice: 4500,
    phone: "+91 98100 33333",
    services: ["Loading", "Transport"],
  },
};

export default function ProviderDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [provider, setProvider] = useState(null);
  const [isBroker, setIsBroker] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setIsBroker(role === "broker");

    setProvider(SAMPLE_PROVIDERS[id] ?? null);
  }, [id]);

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Provider not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title={provider.name} Icon={Truck} />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{provider.name}</h1>
                <button
                  onClick={() => router.back()}
                  className="text-sm text-blue-600"
                >
                  Back
                </button>
              </div>

              <p className="text-gray-700 mb-2">
                Services: {provider.services.join(", ")}
              </p>
              <p className="text-gray-700">
                Starting Price: ₹{provider.startingPrice}
              </p>
            </div>
          </div>

          <aside>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-3">Provider Actions</h3>

              {isBroker ? (
                <>
                  <a
                    href={`tel:${provider.phone}`}
                    className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg mb-3"
                  >
                    Call Provider
                  </a>
                  <button className="w-full px-4 py-2 border rounded-lg">
                    Assign to Broker
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  Contact details visible to verified brokers only.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
