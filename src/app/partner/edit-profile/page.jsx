"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, Building2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user_profile") || "{}"
    );

    setProfile({
      fullName: storedUser.fullName || "Sandhya Khadakhade",
      email: storedUser.email || "sandhya@email.com",
      phone: storedUser.phone || "+91 98765 43210",
    });
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setLoading(true);

    localStorage.setItem("user_profile", JSON.stringify(profile));

    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader Icon={Building2} title="Edit Profile" />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b px-6 py-4 flex gap-6 text-sm font-medium">
            <span className="text-blue-600 border-b-2 border-blue-600 pb-2">
              Profile
            </span>
          </div>

          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </h2>

            <EditableField
              label="Full Name"
              value={profile.fullName}
              icon={User}
              onChange={(v) => handleChange("fullName", v)}
            />

            <EditableField
              label="Email Address"
              value={profile.email}
              icon={Mail}
              type="email"
              onChange={(v) => handleChange("email", v)}
            />

            <ReadOnlyField
              label="Mobile Phone"
              value={profile.phone}
              icon={Phone}
            />

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Mobile number cannot be changed. Contact support for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditableField({ label, value, icon: Icon, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      <div className="flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none"
        />
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value, icon: Icon }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 mb-1 block">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-gray-100 border rounded-lg px-3 py-2">
        {Icon && <Icon className="h-4 w-4 text-gray-500" />}
        <input
          value={value}
          disabled
          className="bg-transparent w-full text-gray-700 cursor-not-allowed"
        />
      </div>
    </div>
  );
}