"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Building2,
  FileText,
  CheckCircle,
  Users,
  Calendar,
} from "lucide-react";
import SiteHeader from "../../components/SiteHeader";

export default function CreateAgreementPage() {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    tenant: "",
    landlord: "",
    email: "",
    countryCode: "+91",
    phone: "",
    rent: "",
    start: "",
    end: "",
    terms: "",
    agreementDurationMonths: "",
    refundableDeposit: "",
    role: "tenant",
    maintenancePaidBy: "tenant",
  });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  useEffect(() => {
  async function detectCountryCode() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      if (data?.country_calling_code) {
        setForm((prev) => ({
          ...prev,
          countryCode: data.country_calling_code,
        }));
      }
    } catch (err) {
      // fallback (India default)
      setForm((prev) => ({
        ...prev,
        countryCode: "+91",
      }));
    }
  }

  detectCountryCode();
}, []);


  const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);

  if (
    !form.email ||
    !form.phone ||
    !form.agreementDurationMonths ||
    !form.refundableDeposit ||
    !form.maintenancePaidBy
  ) {
    alert("Please fill all required fields.");
    setLoading(false);
    return;
  }

  try {
    let stored = [];
    if (typeof window !== "undefined" && window.localStorage) {
      stored = JSON.parse(localStorage.getItem("agreements") || "[]");
    }

    const record = {
      id: Date.now().toString(),
      ...form,
      agreementDurationMonths: Number(form.agreementDurationMonths),
      refundableDeposit: Number(form.refundableDeposit),
      createdAt: new Date().toISOString(),
    };

    stored.unshift(record);

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("agreements", JSON.stringify(stored));
    }

    navigate("/");
  } catch (err) {
    console.error(err);
    alert("Failed to create agreement");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Online Rent Agreement" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HERO */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Rental Agreement Online
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Generate a legally structured rental agreement with all essential
            details for tenants and landlords — quick, simple, and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">
                Why Use Online Rent Agreement
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Feature
                  icon={CheckCircle}
                  title="Legally Structured"
                  text="Covers rent, deposit, duration, and maintenance clauses."
                />
                <Feature
                  icon={Users}
                  title="Tenant & Owner Friendly"
                  text="Clear responsibilities for both parties."
                />
                <Feature
                  icon={Calendar}
                  title="Defined Duration"
                  text="Clear start and end date."
                />
                <Feature
                  icon={FileText}
                  title="Easy Record Keeping"
                  text="Digitally stored agreements for future use."
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold mb-6">How It Works</h2>
              <ol className="space-y-4 text-gray-700">
                <li>1. Enter tenant and landlord details</li>
                <li>2. Add contact and agreement information</li>
                <li>3. Define rent, deposit, and duration</li>
                <li>4. Create and save agreement</li>
              </ol>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
            <h3 className="text-xl font-bold mb-4">
              Rental Agreement Details
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Tenant Name *"
                placeholder="Tenant full name"
                value={form.tenant}
                onChange={(v) => update("tenant", v)}
                required
              />

              <Input
                label="Landlord Name *"
                placeholder="Landlord full name"
                value={form.landlord}
                onChange={(v) => update("landlord", v)}
                required
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(v) => update("email", v)}
                required
              />

              {/* Mobile with country code input */}
              <div>
                <label className="text-sm font-medium">
                  Mobile Number *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.countryCode}
                    onChange={(e) =>
                      update("countryCode", e.target.value)
                    }
                    placeholder="+91"
                    className="w-20 border rounded-lg px-3 py-2 text-center"
                    required
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="10-digit mobile number"
                    className="flex-1 border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="I am"
                  value={form.role}
                  onChange={(v) => update("role", v)}
                  options={[
                    { value: "tenant", label: "Tenant" },
                    { value: "owner", label: "Owner" },
                  ]}
                />
                <Select
                  label="Maintenance Paid By *"
                  value={form.maintenancePaidBy}
                  onChange={(v) =>
                    update("maintenancePaidBy", v)
                  }
                  options={[
                    { value: "tenant", label: "Tenant" },
                    { value: "landlord", label: "Landlord" },
                    { value: "society", label: "Society / Association" },
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Agreement Duration (months) *"
                  type="number"
                  value={form.agreementDurationMonths}
                  onChange={(v) =>
                    update("agreementDurationMonths", v)
                  }
                  required
                />
                <Input
                  label="Refundable Deposit (₹) *"
                  type="number"
                  value={form.refundableDeposit}
                  onChange={(v) =>
                    update("refundableDeposit", v)
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Monthly Rent *"
                  type="number"
                  value={form.rent}
                  onChange={(v) => update("rent", v)}
                  required
                />
                <Input
                  label="Start Date *"
                  type="date"
                  value={form.start}
                  onChange={(v) => update("start", v)}
                  required
                />
              </div>

              <Input
                label="End Date *"
                type="date"
                value={form.end}
                onChange={(v) => update("end", v)}
                required
              />

              <Textarea
                label="Special Terms (Optional)"
                placeholder="Notice period, restrictions, special conditions..."
                value={form.terms}
                onChange={(v) => update("terms", v)}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/properties")}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {loading ? "Creating..." : "Create Agreement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* HELPERS */

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

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>
  );
}
