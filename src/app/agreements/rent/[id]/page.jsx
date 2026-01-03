"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function RentAgreementDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(null);
  const [isBroker, setIsBroker] = useState(false);

  useEffect(() => {
    try {
      setIsBroker(localStorage.getItem("user_role") === "broker");
      const stored = JSON.parse(localStorage.getItem("agreements") || "[]");
      const found = (stored || []).find((a) => String(a.id) === String(id));
      setAgreement(found || null);
    } catch (e) {
      setAgreement(null);
    }
  }, [id]);

  if (!agreement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Agreement not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="EstateHubster" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">Rental Agreement</h1>
                <button onClick={() => navigate(-1)} className="text-sm text-blue-600">Back</button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tenant</p>
                  <p className="font-medium">{agreement.tenant}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Landlord</p>
                  <p className="font-medium">{agreement.landlord}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Rent</p>
                    <p className="font-medium">₹{agreement.rent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{agreement.agreementDurationMonths} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deposit</p>
                    <p className="font-medium">₹{agreement.refundableDeposit}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Maintenance Paid By</p>
                  <p className="font-medium">{agreement.maintenancePaidBy}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Terms</p>
                  <p className="text-gray-700 whitespace-pre-line">{agreement.terms || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-bold mb-3">Broker Actions</h3>
              {isBroker ? (
                <>
                  <a href={`tel:${agreement.phone || agreement.contact || ''}`} className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg mb-3">Call Tenant</a>
                  <button onClick={() => alert('Marking as processed (demo)')} className="w-full px-4 py-2 border rounded-lg">Mark Processed</button>
                </>
              ) : (
                <p className="text-sm text-gray-600">Contact details visible to verified brokers only.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
