"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function PropertyTransferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState(null);
  const [isBroker, setIsBroker] = useState(false);

  useEffect(() => {
    try {
      setIsBroker(localStorage.getItem('user_role') === 'broker');
      const stored = JSON.parse(localStorage.getItem('property_transfers') || '[]');
      const found = (stored || []).find((t) => String(t.id) === String(id));
      setTransfer(found || null);
    } catch (e) {
      setTransfer(null);
    }
  }, [id]);

  if (!transfer) return <div className="min-h-screen flex items-center justify-center">Transfer record not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Property Transfer" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">Property Transfer</h1>
                <button onClick={() => navigate(-1)} className="text-sm text-blue-600">Back</button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="font-medium">{transfer.propertyTitle || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Seller</p>
                  <p className="font-medium">{transfer.sellerName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Buyer</p>
                  <p className="font-medium">{transfer.buyerName || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-3">Transfer Details</h3>
              {isBroker ? (
                <div className="space-y-2 text-sm text-gray-700">
                  <div>Seller Phone: <span className="font-medium">{transfer.sellerPhone || 'N/A'}</span></div>
                  <div>Buyer Phone: <span className="font-medium">{transfer.buyerPhone || 'N/A'}</span></div>
                  <div>Documents: <span className="font-medium">{transfer.documents ? transfer.documents.join(', ') : 'N/A'}</span></div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">Full transfer details are visible to verified brokers only.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
