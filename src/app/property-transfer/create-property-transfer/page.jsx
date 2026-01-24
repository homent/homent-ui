"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  User,
  MapPin,
  Calendar,
  ShieldCheck,
  Scale,
} from "lucide-react";
import SiteHeader from "../../components/SiteHeader";

export default function PropertyTransferPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    sellerName: "",
    buyerName: "",
    phone: "",
    email: "",
    propertyType: "apartment",
    propertyAddress: "",
    transferType: "sale",
    preferredDate: "",
    services: [],
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const propertyTypes = [
    { value: "apartment", label: "Apartment / Flat" },
    { value: "villa", label: "Villa / Independent House" },
    { value: "plot", label: "Residential Plot" },
    { value: "commercial", label: "Commercial Property" },
  ];

  const transferTypes = [
    { value: "sale", label: "Sale Deed" },
    { value: "gift", label: "Gift Deed" },
    { value: "inheritance", label: "Inheritance / Will" },
  ];

  const serviceOptions = [
    { id: "documentation", label: "Legal Documentation" },
    { id: "verification", label: "Property Verification" },
    { id: "stamp", label: "Stamp Duty Calculation" },
    { id: "registration", label: "Sub-Registrar Appointment" },
    { id: "loan", label: "Bank Loan Assistance" },
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleService = (id) => {
    const updated = formData.services.includes(id)
      ? formData.services.filter((s) => s !== id)
      : [...formData.services, id];
    updateFormData("services", updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.sellerName ||
      !formData.buyerName ||
      !formData.phone ||
      !formData.propertyAddress
    ) {
      setError("Please fill all mandatory fields");
      return;
    }

    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1000));

      const existing =
        JSON.parse(localStorage.getItem("property_transfers")) || [];

      const newTransfer = {
        id: crypto.randomUUID(),
        sellerName: formData.sellerName,
        buyerName: formData.buyerName,
        phone: formData.phone,
        email: formData.email,
        propertyType: formData.propertyType,
        propertyAddress: formData.propertyAddress,
        transferType: formData.transferType,
        preferredDate: formData.preferredDate,
        services: formData.services,
        notes: formData.notes,
        propertyTitle: `${formData.propertyType.toUpperCase()} Transfer`,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "property_transfers",
        JSON.stringify([newTransfer, ...existing])
      );

      setSuccess(true);

      setTimeout(() => {
        router.push("/property-transfer");
      }, 1200);
    } catch {
      setError("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <SiteHeader Icon={Building2} title="Property Transfer" />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Property Transfer Service</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Hassle-free property ownership transfer with legal experts,
            transparent pricing, and end-to-end support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Why Choose */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Feature icon={Scale} title="Legal Experts" text="Experienced property lawyers handle your case" />
                <Feature icon={ShieldCheck} title="100% Compliance" text="Government-approved & legally verified process" />
                <Feature icon={Calendar} title="Quick Registration" text="Fast appointments with Sub-Registrar office" />
                <Feature icon={User} title="Dedicated Manager" text="Single point of contact till completion" />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Transparent Pricing</h2>
              <div className="border p-4 rounded-lg flex justify-between">
                <span>Property Transfer Assistance</span>
                <span className="font-bold text-blue-600">From ₹9,999</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Stamp duty & registration charges as per state rules.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
            <h3 className="text-xl font-bold mb-4">Get Started</h3>

            {success && (
              <div className="bg-green-50 border border-green-200 p-4 mb-4 rounded">
                Request submitted successfully!
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-4 mb-4 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Seller Name *" value={formData.sellerName} onChange={(v) => updateFormData("sellerName", v)} />
              <Input label="Buyer Name *" value={formData.buyerName} onChange={(v) => updateFormData("buyerName", v)} />
              <Input label="Phone *" value={formData.phone} onChange={(v) => updateFormData("phone", v)} />
              <Input label="Email" value={formData.email} onChange={(v) => updateFormData("email", v)} />

              <div>
                <label className="text-sm font-medium">Property Type</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.propertyType}
                  onChange={(e) => updateFormData("propertyType", e.target.value)}
                >
                  {propertyTypes.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Property Address *"
                value={formData.propertyAddress}
                onChange={(v) => updateFormData("propertyAddress", v)}
              />

              <div>
                <label className="text-sm font-medium">Transfer Type</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.transferType}
                  onChange={(e) => updateFormData("transferType", e.target.value)}
                >
                  {transferTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Preferred Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.preferredDate}
                  onChange={(e) => updateFormData("preferredDate", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Services Needed</label>
                {serviceOptions.map((s) => (
                  <label key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(s.id)}
                      onChange={() => toggleService(s.id)}
                    />
                    <span className="text-sm">{s.label}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-custom text-white py-3 rounded-lg font-medium"
              >
                {loading ? "Submitting..." : "Request Callback"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Components */
function Feature({ icon: Icon, title, text }) {
  return (
    <div className="flex gap-4">
      <Icon className="h-6 w-6 text-blue-600" />
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}
