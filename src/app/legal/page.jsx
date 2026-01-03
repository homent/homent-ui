"use client";

import { useState } from "react";
import {
  Building2,
  Scale,
  FileText,
  CheckCircle,
  Clock,
  Users,
} from "lucide-react";
import { toast } from 'sonner';
import SiteHeader from "@/components/SiteHeader";


export default function LegalServicesPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    serviceType: "document_review",
    consultationMode: "call",
    city: "",
    state: "Maharashtra",
    remarks: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const services = [
    {
      id: "document_review",
      title: "Document Review",
      description:
        "Get your property documents reviewed by expert legal consultants",
      price: "₹5,000",
      duration: "2-3 days",
      icon: FileText,
    },
    {
      id: "sale_deed_drafting",
      title: "Sale Deed Drafting",
      description:
        "Professional drafting of sale deed for property transactions",
      price: "₹10,000",
      duration: "3-5 days",
      icon: FileText,
    },
    {
      id: "registration_support",
      title: "Registration Support",
      description:
        "Complete support for property registration with authorities",
      price: "₹15,000",
      duration: "5-7 days",
      icon: CheckCircle,
    },
    {
      id: "full_package",
      title: "Full Legal Package",
      description:
        "Comprehensive legal support including docs, drafting & registration",
      price: "₹25,000",
      duration: "10-15 days",
      icon: Scale,
    },
    {
      id: "property_transfer",
      title: "Property Transfer (PMC/PCMC)",
      description:
        "Legal support for property transfer to municipality records",
      price: "₹8,000",
      duration: "7-10 days",
      icon: Users,
    },
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/legal-services", {
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
          serviceType: "document_review",
          consultationMode: "call",
          city: "",
          state: "Maharashtra",
          remarks: "",
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader Icon={Building2} title="Legal Services" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Scale className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with experienced legal consultants for all your property law
            needs. Expert guidance for documentation, registration, and
            transfers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Services
            </h2>
            <div className="space-y-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      updateFormData("serviceType", service.id);
                    }}
                    className={`cursor-pointer p-6 rounded-lg border-2 transition-all ${
                      selectedService === service.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Icon className="h-8 w-8 text-blue-600 mt-1" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {service.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {service.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {service.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {service.price}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Book a Consultation
              </h3>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <p className="font-medium">Request submitted successfully!</p>
                  <p className="text-sm mt-1">
                    Our team will contact you soon.
                  </p>
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
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Mode *
                  </label>
                  <select
                    value={formData.consultationMode}
                    onChange={(e) =>
                      updateFormData("consultationMode", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="call">Phone Call</option>
                    <option value="video">Video Call</option>
                    <option value="in_person">In Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => updateFormData("remarks", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional information..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedService}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? "Submitting..." : "Book Consultation"}
                </button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  Our legal experts will contact you within 24 hours
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select Service
              </h3>
              <p className="text-gray-600">
                Choose the legal service you need from our comprehensive list
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Book Consultation
              </h3>
              <p className="text-gray-600">
                Fill in your details and choose your preferred consultation mode
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Expert Review
              </h3>
              <p className="text-gray-600">
                Our legal experts will review your case and contact you
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mb-4">
                <span className="text-lg font-bold">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Resolution
              </h3>
              <p className="text-gray-600">
                Complete the service with professional legal guidance
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How long does the process take?
              </h3>
              <p className="text-gray-600">
                The timeline varies by service. Most services are completed
                within 5-15 days depending on complexity and documentation
                requirements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Are the consultants qualified?
              </h3>
              <p className="text-gray-600">
                Yes, all our legal consultants are highly experienced
                professionals with proven track records in property law and real
                estate transactions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What documents do I need?
              </h3>
              <p className="text-gray-600">
                Our team will guide you through the required documents during
                the initial consultation. Usually includes property deed, ID
                proof, and related documents.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change the consultation mode?
              </h3>
              <p className="text-gray-600">
                Yes, you can change your consultation mode anytime. Our team
                will be happy to accommodate your preferences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
