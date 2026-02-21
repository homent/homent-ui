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
import Select from 'react-select';
import SiteHeader from "../components/SiteHeader";
import { submitEnquiry } from '../services/apiService';
import { states, cities } from '../services/constant';

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
      const data = {
        name: formData.userName,
        email: formData.userEmail,
        phone: formData.userPhone,
        countryCode: "+91",
        city: formData.city,
        state: formData.state,
        consultationMode: formData.consultationMode.toUpperCase(),
        note: formData.remarks,
      };

      await submitEnquiry('ADD_LEGAL_ENQUIRY', data);

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
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
      <SiteHeader Icon={Building2} title="Legal Services" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="relative text-center mb-20">
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="h-64 w-64 rounded-full bg-orange-100 blur-3xl opacity-40" />
        </div>

        {/* Icon badge */}
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-custom text-white mb-6 shadow-lg shadow-orange-200">
          <Scale className="h-10 w-10" />
        </div>

        {/* Heading */}
        <h1 className="text-xl md:text-5xl font-extrabold properties-text-color mb-5 leading-tight">
          Legal Services
        </h1>

      {/* Sub text */}
      <p className="text-lg md:text-xl properties-text-color max-w-3xl mx-auto leading-relaxed">
        Connect with experienced legal consultants for all your property law
        needs. Expert guidance for documentation, registration, and
        transfers.
      </p>

      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold properties-text-color mb-6">
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
                        ? "border-orange-custom bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Icon className="h-8 w-8 text-orange-custom mt-1" />
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
                        <p className="text-2xl font-bold text-orange-custom">
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
              <h3 className="text-xl font-bold properties-text-color mb-6">
                Book a Consultation
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
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) => updateFormData("userName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <Select
                    options={cities}
                    value={cities.find(city => city.value === formData.city) || null}
                    onChange={(selectedOption) =>
                      updateFormData('city', selectedOption?.value || '')
                    }
                    placeholder="Select city"
                    isClearable
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <Select
                    options={states}
                    value={states.find(state => state.value === formData.state) || null}
                    onChange={(selectedOption) =>
                      updateFormData('state', selectedOption?.value || '')
                    }
                    placeholder="Select state"
                    isClearable
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Any additional information..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading} //!selectedService
                  className="w-full px-4 py-3 bg-orange-custom text-white rounded-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                >
                  {loading ? "Submitting..." : "Book Consultation"}
                </button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  Our legal experts will contact you within 24 hours
                </p>
              </form>
              )}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold properties-text-color mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-orange-custom text-white mb-4">
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
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-orange-custom text-white mb-4">
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
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-orange-custom text-white mb-4">
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
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-md bg-orange-custom text-white mb-4">
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
