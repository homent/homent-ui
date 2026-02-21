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
import { submitEnquiry } from '../../services/apiService';

export default function CreateAgreementPage() {
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

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

  const update = (k, v) => {
    setForm((s) => ({ ...s, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: '' })); // Clear error for this field
  };

  useEffect(() => {
    if (form.start && form.agreementDurationMonths) {
      const startDate = new Date(form.start);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + parseInt(form.agreementDurationMonths));
      const endDateString = endDate.toISOString().split('T')[0];
      setForm((prev) => ({ ...prev, end: endDateString }));
    }
  }, [form.start, form.agreementDurationMonths]);

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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear all errors

    let newErrors = {};

    if (!form.tenant) newErrors.tenant = "Tenant name is required.";
    if (!form.landlord) newErrors.landlord = "Landlord name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    if (!form.phone) newErrors.phone = "Phone number is required.";
    if (!form.rent) newErrors.rent = "Monthly rent is required.";
    if (!form.start) newErrors.start = "Start date is required.";
    if (!form.agreementDurationMonths) newErrors.agreementDurationMonths = "Agreement duration is required.";
    if (!form.refundableDeposit) newErrors.refundableDeposit = "Refundable deposit is required.";
    if (!form.maintenancePaidBy) newErrors.maintenancePaidBy = "Maintenance payer is required.";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    // Numeric validations
    if (form.rent && (isNaN(form.rent) || form.rent <= 0)) {
      newErrors.rent = "Please enter a valid monthly rent.";
    }

    if (form.agreementDurationMonths && (isNaN(form.agreementDurationMonths) || form.agreementDurationMonths <= 0)) {
      newErrors.agreementDurationMonths = "Please enter a valid agreement duration.";
    }

    if (form.refundableDeposit && (isNaN(form.refundableDeposit) || form.refundableDeposit < 0)) {
      newErrors.refundableDeposit = "Please enter a valid refundable deposit.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const data = {
        tenantName: form.tenant,
        landlordName: form.landlord,
        email: form.email,
        mobile: form.phone,
        countryCode: form.countryCode,
        promise: "product",
        agreementDuration: Number(form.agreementDurationMonths),
        refundableDeposit: Number(form.refundableDeposit),
        deposit: 0, // Assuming no separate deposit field
        monthlyRent: Number(form.rent),
        startDate: form.start,
        endDate: form.end,
        customerId: "customerId",
        note: form.terms,
      };

      await submitEnquiry('ADD_AGREEMENT_ENQUIRY', data);
    } catch (apiError) {
      console.error("API Error:", apiError);
      // Continue with local storage save even if API fails
    }

    // Still save to localStorage for demo
    try{
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

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to create agreement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <SiteHeader title="Online Rent Agreement" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* HERO */}
        <div className="relative text-center mb-20">
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="h-64 w-64 rounded-full bg-orange-100 blur-3xl opacity-40" />
        </div>

        {/* Icon badge */}
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-custom text-white mb-6 shadow-lg shadow-orange-200">
          <FileText className="h-10 w-10" />
        </div>

        {/* Heading */}
        <h1 className="text-xl md:text-5xl font-extrabold properties-text-color mb-5 leading-tight">
          Create Your Rental Agreement Online
        </h1>

      {/* Sub text */}
      <p className="text-lg md:text-xl properties-text-color max-w-3xl mx-auto leading-relaxed">
        Generate a legally structured rental agreement with all essential
        details for tenants and landlords — quick, simple, and reliable.
      </p>

      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold properties-text-color mb-6">
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
              <h2 className="text-2xl font-bold properties-text-color mb-6">How It Works</h2>
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
            <h3 className="text-xl font-bold properties-text-color mb-4">
              Rental Agreement Details
            </h3>

            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-green-600">
                  Thank you! Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit } className="space-y-4">
              <Input
                label="Tenant Name *"
                placeholder="Tenant full name"
                value={form.tenant}
                onChange={(v) => update("tenant", v)}
                required
                error={errors.tenant}
              />

              <Input
                label="Landlord Name *"
                placeholder="Landlord full name"
                value={form.landlord}
                onChange={(v) => update("landlord", v)}
                required
                error={errors.landlord}
              />

              <Input
                label="Email Address *"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={(v) => update("email", v)}
                required
                error={errors.email}
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
                    className={`flex-1 border rounded-lg px-3 py-2 ${errors.phone ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                  error={errors.maintenancePaidBy}
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
                  error={errors.agreementDurationMonths}
                />
                <Input
                  label="Refundable Deposit (₹) *"
                  type="number"
                  value={form.refundableDeposit}
                  onChange={(v) =>
                    update("refundableDeposit", v)
                  }
                  required
                  error={errors.refundableDeposit}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Monthly Rent *"
                  type="number"
                  value={form.rent}
                  onChange={(v) => update("rent", v)}
                  required
                  error={errors.rent}
                />
                <Input
                  label="Start Date *"
                  type="date"
                  value={form.start}
                  onChange={(v) => update("start", v)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  error={errors.start}
                />
              </div>

              <Input
                label="End Date *"
                type="date"
                value={form.end}
                onChange={(v) => update("end", v)}
                required
                readOnly
              />

              <Textarea
                label="Special Terms (Optional)"
                placeholder="Notice period, restrictions, special conditions..."
                value={form.terms}
                onChange={(v) => update("terms", v)}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-orange-custom text-white rounded hover:opacity-90 active:scale-[0.98] transition"
                >
                  {loading ? "Creating..." : "Create Agreement"}
                </button>
              </div>
            </form>
            )}
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
      <Icon className="h-6 w-6 text-orange-custom" />
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
  min,
  readOnly,
  error,
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
        className={`w-full border rounded-lg px-3 py-2 ${error ? 'border-red-500' : ''}`}
        min={min}
        readOnly={readOnly}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, required, error }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border rounded-lg px-3 py-2 ${error ? 'border-red-500' : ''}`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
