"use client";

import { useState } from "react";
import {
  Building2,
  Truck,
  Package,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

export default function MoversPage() {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    vehicleType: "tempo",
    originAddress: "",
    destinationAddress: "",
    preferredMoveDate: "",
    preferredTimeSlot: "9am-12pm",
    approxVolume: "100-200",
    servicesRequired: [],
    specialItems: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const vehicleTypes = [
    { value: "tempo", label: "Tempo (Basic)", capacity: "5-10 boxes" },
    { value: "truck", label: "Truck (Standard)", capacity: "20-30 boxes" },
    { value: "lorry", label: "Lorry (Large)", capacity: "40-50 boxes" },
  ];

  const serviceOptions = [
    { id: "packing", label: "Packing Materials & Service" },
    { id: "loading", label: "Loading Service" },
    { id: "transport", label: "Transportation" },
    { id: "unloading", label: "Unloading Service" },
    { id: "insurance", label: "Goods Insurance" },
    { id: "storage", label: "Storage Facility" },
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const toggleService = (serviceId) => {
    const updated = formData.servicesRequired.includes(serviceId)
      ? formData.servicesRequired.filter((id) => id !== serviceId)
      : [...formData.servicesRequired, serviceId];
    updateFormData("servicesRequired", updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.userName ||
      !formData.userEmail ||
      !formData.userPhone ||
      !formData.originAddress ||
      !formData.destinationAddress
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/moving-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          userName: "",
          userEmail: "",
          userPhone: "",
          vehicleType: "tempo",
          originAddress: "",
          destinationAddress: "",
          preferredMoveDate: "",
          preferredTimeSlot: "9am-12pm",
          approxVolume: "100-200",
          servicesRequired: [],
          specialItems: "",
          notes: "",
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError("Failed to submit request. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      setError("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader Icon={Building2} title="Packers & Movers" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Truck className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Packers & Movers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional moving services with real-time tracking, insurance
            coverage, and guaranteed safe delivery of your belongings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Why Choose Us */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose Our Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Professional Packing
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Expert packing with premium materials to protect your
                      valuables
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Real-time Tracking
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Track your belongings every step of the way with GPS
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      On-time Delivery
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Guaranteed delivery on your preferred date and time slot
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Insurance Coverage
                    </h3>
                    <p className="text-gray-600 mt-2">
                      Complete insurance coverage for all items during transit
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services & Pricing */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Service Pricing
              </h2>
              <div className="space-y-4">
                {vehicleTypes.map((vehicle) => (
                  <div
                    key={vehicle.value}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {vehicle.label}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Capacity: {vehicle.capacity}
                        </p>
                      </div>
                      <span className="text-xl font-bold text-blue-600">
                        From ₹5,000
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-6">
                * Prices vary based on distance, volume, and additional
                services. Final quote will be provided after assessment.
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Get a Quote
              </h3>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <p className="font-medium">Request submitted!</p>
                  <p className="text-sm mt-1">
                    Our team will contact you with a quote.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => updateFormData("userName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.userEmail}
                    onChange={(e) =>
                      updateFormData("userEmail", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.userPhone}
                    onChange={(e) =>
                      updateFormData("userPhone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10-digit mobile"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From (Origin) *
                  </label>
                  <input
                    type="text"
                    value={formData.originAddress}
                    onChange={(e) =>
                      updateFormData("originAddress", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Current location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To (Destination) *
                  </label>
                  <input
                    type="text"
                    value={formData.destinationAddress}
                    onChange={(e) =>
                      updateFormData("destinationAddress", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="New location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) =>
                      updateFormData("vehicleType", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {vehicleTypes.map((vehicle) => (
                      <option key={vehicle.value} value={vehicle.value}>
                        {vehicle.label} - {vehicle.capacity}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Move Date *
                  </label>
                  <input
                    type="date"
                    value={formData.preferredMoveDate}
                    onChange={(e) =>
                      updateFormData("preferredMoveDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slot *
                  </label>
                  <select
                    value={formData.preferredTimeSlot}
                    onChange={(e) =>
                      updateFormData("preferredTimeSlot", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="9am-12pm">9 AM - 12 PM</option>
                    <option value="12pm-3pm">12 PM - 3 PM</option>
                    <option value="3pm-6pm">3 PM - 6 PM</option>
                    <option value="6pm-9pm">6 PM - 9 PM</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Services Needed
                  </label>
                  <div className="space-y-2">
                    {serviceOptions.map((service) => (
                      <label key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.servicesRequired.includes(
                            service.id,
                          )}
                          onChange={() => toggleService(service.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {service.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Items/Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any fragile items or special requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? "Submitting..." : "Get Quote"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
