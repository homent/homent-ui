"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  ShieldCheck,
  Users,
  Wallet,
  CalendarCheck,
  PhoneCall,
} from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import { Input, Select, Feature, Textarea } from "../components/form-helpers";

export default function RentalPropertyManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    phone: "",
    city: "",
    propertyType: "",
    message: "",
  });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!form.ownerName || !form.email || !form.phone || !form.city) {
      alert("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const enquiries =
        JSON.parse(localStorage.getItem("property_management_leads")) || [];

      enquiries.unshift({
        id: Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem(
        "property_management_leads",
        JSON.stringify(enquiries)
      );

      alert("Thank you! Our team will contact you shortly.");
      router.push("/");
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <SiteHeader
        title="Property Management Services in Pune"
        Icon={Home}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* HERO */}
        <div className="relative text-center mb-20">
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="h-64 w-64 rounded-full bg-orange-100 blur-3xl opacity-40" />
        </div>

        {/* Icon badge */}
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-custom text-white mb-6 shadow-lg shadow-orange-200">
          <Home className="h-10 w-10" />
        </div>

        {/* Heading */}
        <h1 className="text-xl md:text-5xl font-extrabold properties-text-color mb-5 leading-tight">
          End-to-End Rental{" "}
          <span className="relative inline-block">
            <span className="relative z-10 properties-text-color">
              Property Management
            </span>
            <span className="absolute inset-x-0 bottom-1 h-3 -z-0 rounded-sm" />
          </span>
        </h1>

      {/* Sub text */}
      <p className="text-lg md:text-xl properties-text-color max-w-3xl mx-auto leading-relaxed">
        Hassle-free rental management for homeowners & NRIs.  
        We take care of <span className="font-medium properties-text-color">tenants, rent, maintenance</span>  
        and <span className="font-medium properties-text-color">legal compliance</span> — end to end.
      </p>

      </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* WHY US */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 properties-text-color shadow-sm hover:shadow-md transition">
              <h2 className="text-2xl font-bold mb-6">
                What You Get With Our Service
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Reliable Tenant Verification",
                    text: "Background checks and documentation for secure occupancy.",
                  },
                  {
                    icon: Wallet,
                    title: "Rent Collection & Timely Payouts",
                    text: "We ensure rent follow-ups and on-time credits.",
                  },
                  {
                    icon: Users,
                    title: "Dedicated Property Manager",
                    text: "Single point of contact for all your property needs.",
                  },
                  {
                    icon: CalendarCheck,
                    title: "Periodic Inspections",
                    text: "Scheduled inspections to maintain property value.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="group bg-gray-50 rounded-xl p-5 border border-transparent hover:bg-white hover:border-gray-200 transition"
                  >
                    <Feature
                      icon={f.icon}
                      title={f.title}
                      text={f.text}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* SERVICES */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 properties-text-color shadow-sm hover:shadow-md transition">
              <h2 className="text-2xl font-bold mb-8">
                Services Included
              </h2>

              <div className="space-y-5">
                {[
                  {
                    title: "Premium Property Listing & Promotion",
                    time: "2–3 Days",
                    desc: "Professional listing creation with photos and promotion across high-intent tenant channels.",
                  },
                  {
                    title: "Tenant Search & Onboarding",
                    time: "7–15 Days",
                    desc: "Shortlisting, coordination, background checks, and smooth tenant onboarding.",
                  },
                  {
                    title: "Free E-Stamped Rental Agreement",
                    time: "1 Day",
                    desc: "Legally compliant rental agreement drafted and delivered digitally.",
                  },
                  {
                    title: "Repair & Maintenance Coordination",
                    time: "On-Demand",
                    desc: "Verified vendors for quick repairs, regular maintenance, and issue resolution.",
                  },
                  {
                    title: "Utility Bills & Society Dues Handling",
                    time: "Monthly",
                    desc: "Timely payment tracking of electricity, water, and society charges.",
                  },
                  {
                    title: "Legal & Compliance Assistance",
                    time: "As Required",
                    desc: "Support for tenant disputes, notices, and property compliance needs.",
                  },
                ].map((service) => (
                  <div
                    key={service.title}
                    className="group flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200 transition"
                  >
                    {/* Timeline dot */}
                    <div className="mt-2">
                      <span className="flex h-3 w-3 rounded-full bg-orange-custom" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold properties-text-color group-hover:text-orange-custom transition">
                          {service.title}
                        </h4>
                        <span className="text-xs font-medium bg-orange-100 text-orange-custom px-2 py-1 rounded-full">
                          ⏱ {service.time}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            {/* HOW IT WORKS */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
              <h2 className="text-2xl font-bold mb-6 properties-text-color">
                How It Works
              </h2>

              <ol className="space-y-4 properties-text-color">
                {[
                  "Share your property details with us",
                  "Get a dedicated property manager assigned",
                  "We manage tenants, rent & maintenance",
                  "Receive regular updates & reports",
                ].map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-custom font-semibold">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg sticky top-8">
            <h3 className="text-2xl font-bold mb-1 properties-text-color">
              Get a Free Consultation
            </h3>
            <p className="text-sm properties-text-color mb-6">
              Talk to a property expert today
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Owner Name *"
                value={form.ownerName}
                onChange={(v) => update("ownerName", v)}
                placeholder="Your full name"
                required
              />

              <Input
                label="Email Address *"
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                placeholder="you@email.com"
                required
              />

              <Input
                label="Mobile Number *"
                value={form.phone}
                onChange={(v) => update("phone", v)}
                placeholder="10-digit mobile number"
                required
              />

              <Input
                label="Property City *"
                value={form.city}
                onChange={(v) => update("city", v)}
                placeholder="Pune"
                required
              />

              <Select
                label="Property Type"
                value={form.propertyType}
                onChange={(v) => update("propertyType", v)}
                options={[
                  { value: "", label: "Select property type" },
                  { value: "apartment", label: "Apartment / Flat" },
                  { value: "villa", label: "Villa / Independent House" },
                  { value: "commercial", label: "Commercial Property" },
                ]}
              />

              <Textarea
                label="Additional Notes (Optional)"
                value={form.message}
                onChange={(v) => update("message", v)}
                placeholder="Any specific requirement or question"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-orange-custom text-white py-3 rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition"
              >
                <PhoneCall className="h-4 w-4" />
                {loading ? "Submitting..." : "Request Callback"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
