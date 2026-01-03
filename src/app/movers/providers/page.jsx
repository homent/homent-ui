"use client";

import { Link } from "react-router-dom";
import { Truck, Building2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const SAMPLE_PROVIDERS = [
  { id: 'p1', name: 'MoveFast Packers', rating: 4.6, startingPrice: 5000, phone: '+91 98100 11111' },
  { id: 'p2', name: 'SafeShift Movers', rating: 4.4, startingPrice: 7000, phone: '+91 98100 22222' },
  { id: 'p3', name: 'QuickLoad Logistics', rating: 4.2, startingPrice: 4500, phone: '+91 98100 33333' },
];

export default function MoversProvidersList() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Packers & Movers" Icon={Truck} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {SAMPLE_PROVIDERS.map((p) => (
                <Link to={`/movers/providers/${p.id}`} key={p.id} className="block bg-white p-4 rounded shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-600">From ₹{p.startingPrice}</div>
                    </div>
                    <div className="text-sm text-gray-500">{p.rating} ★</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Get a Quote</h3>
              <p className="text-sm text-gray-600 mb-4">Fill the quote form available on the main Packers page.</p>
              <Link to="/movers" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg">Open Quote Form</Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
