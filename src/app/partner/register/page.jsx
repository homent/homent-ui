"use client";

import { useState } from "react";
import { Building2, ArrowRight, ArrowLeft, Check, Upload } from "lucide-react";
import { toast } from 'sonner';

export default function PartnerRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    password: "",
    confirmPassword: "",
    servingAreas: [],
    totalExperience: "",
    knownLanguages: [],
    commissionPercentage: "",
    businessContactNumber: "",
    role: "",
    aadharFront: null,
    aadharBack: null,
    panLicense: null,
    photo: null,
    bankingName: "",
    bankName: "",
    bankAccountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    upiId: "",
  });

  const [newArea, setNewArea] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const addArea = () => {
    if (newArea.trim() && !formData.servingAreas.includes(newArea.trim())) {
      updateFormData("servingAreas", [
        ...formData.servingAreas,
        newArea.trim(),
      ]);
      setNewArea("");
    }
  };

  const removeArea = (index) => {
    updateFormData(
      "servingAreas",
      formData.servingAreas.filter((_, i) => i !== index),
    );
  };

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.knownLanguages.includes(newLanguage.trim())
    ) {
      updateFormData("knownLanguages", [
        ...formData.knownLanguages,
        newLanguage.trim(),
      ]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (index) => {
    updateFormData(
      "knownLanguages",
      formData.knownLanguages.filter((_, i) => i !== index),
    );
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.mobile ||
        !formData.gender ||
        !formData.dateOfBirth ||
        !formData.address ||
        !formData.password
      ) {
        setError("All fields are required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
    } else if (currentStep === 2) {
      if (
        !formData.totalExperience ||
        !formData.commissionPercentage ||
        !formData.role ||
        formData.servingAreas.length === 0 ||
        formData.knownLanguages.length === 0
      ) {
        setError("All fields are required");
        return false;
      }
    } else if (currentStep === 3) {
      if (
        !formData.aadharFront ||
        !formData.aadharBack ||
        !formData.panLicense ||
        !formData.photo
      ) {
        setError("All documents are required");
        return false;
      }
    } else if (currentStep === 4) {
      if (
        !formData.bankingName ||
        !formData.bankName ||
        !formData.bankAccountNumber ||
        !formData.ifscCode
      ) {
        setError("All required fields must be filled");
        return false;
      }
      if (formData.bankAccountNumber !== formData.confirmAccountNumber) {
        setError("Bank account numbers do not match");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Registration submitted successfully! We will review your application.");
        window.location.href = "/";
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                EstateHubster
              </span>
            </div>
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Become a EstateHubster Partner
          </h1>
          <p className="text-gray-600">
            Join our platform and start earning commissions
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <Check className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Basic Details</span>
            <span>Work Details</span>
            <span>Documents</span>
            <span>Bank Details</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <BasicDetailsStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 2 && (
            <WorkDetailsStep
              formData={formData}
              updateFormData={updateFormData}
              newArea={newArea}
              setNewArea={setNewArea}
              addArea={addArea}
              removeArea={removeArea}
              newLanguage={newLanguage}
              setNewLanguage={setNewLanguage}
              addLanguage={addLanguage}
              removeLanguage={removeLanguage}
            />
          )}
          {currentStep === 3 && (
            <DocumentsStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
          {currentStep === 4 && (
            <BankDetailsStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>

        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BasicDetailsStep({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData("firstName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter first name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData("lastName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter last name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile *
          </label>
          <input
            type="tel"
            value={formData.mobile}
            onChange={(e) => updateFormData("mobile", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="10-digit mobile number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => updateFormData("gender", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => updateFormData("address", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full address"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="At least 6 characters"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateFormData("confirmPassword", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Re-enter password"
            required
          />
        </div>
      </div>
    </div>
  );
}

function WorkDetailsStep({
  formData,
  updateFormData,
  newArea,
  setNewArea,
  addArea,
  removeArea,
  newLanguage,
  setNewLanguage,
  addLanguage,
  removeLanguage,
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serving Areas *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addArea()}
              placeholder="e.g., Koregaon Park, Baner"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addArea}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.servingAreas.map((area, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {area}
                <button
                  type="button"
                  onClick={() => removeArea(index)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Experience (Years) *
          </label>
          <input
            type="number"
            value={formData.totalExperience}
            onChange={(e) => updateFormData("totalExperience", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commission Percentage *
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.commissionPercentage}
            onChange={(e) =>
              updateFormData("commissionPercentage", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 2.5"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Known Languages *
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addLanguage()}
              placeholder="e.g., English, Hindi, Marathi"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.knownLanguages.map((language, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {language}
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Contact Number
          </label>
          <input
            type="tel"
            value={formData.businessContactNumber}
            onChange={(e) =>
              updateFormData("businessContactNumber", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role/Designation *
          </label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => updateFormData("role", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Real Estate Agent, Broker"
            required
          />
        </div>
      </div>
    </div>
  );
}

function DocumentsStep({ formData, updateFormData }) {
  const handleFileChange = (field, file) => {
    updateFormData(field, file);
  };

  const getFileName = (file) => {
    return file ? file.name : "No file selected";
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Documents</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhar Card (Front) *
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                handleFileChange("aadharFront", e.target.files?.[0])
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {getFileName(formData.aadharFront)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click to upload image or PDF
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhar Card (Back) *
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                handleFileChange("aadharBack", e.target.files?.[0])
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {getFileName(formData.aadharBack)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click to upload image or PDF
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Card / Driving License *
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                handleFileChange("panLicense", e.target.files?.[0])
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {getFileName(formData.panLicense)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click to upload image or PDF
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo *
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange("photo", e.target.files?.[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors">
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {getFileName(formData.photo)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click to upload passport-size photo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">
          Document Requirements:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Aadhar card (both sides) - clear, legible copy</li>
          <li>• PAN card or Driving License</li>
          <li>• Passport-size photo (clear face visible)</li>
          <li>• Maximum file size: 5MB each</li>
        </ul>
      </div>
    </div>
  );
}

function BankDetailsStep({ formData, updateFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bank Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Holder Name *
          </label>
          <input
            type="text"
            value={formData.bankingName}
            onChange={(e) => updateFormData("bankingName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Name as per bank account"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Name *
          </label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) => updateFormData("bankName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., HDFC Bank, ICICI Bank"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bank Account Number *
          </label>
          <input
            type="text"
            value={formData.bankAccountNumber}
            onChange={(e) =>
              updateFormData("bankAccountNumber", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Account number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Re-enter Account Number *
          </label>
          <input
            type="text"
            value={formData.confirmAccountNumber}
            onChange={(e) =>
              updateFormData("confirmAccountNumber", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Re-enter account number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            IFSC Code *
          </label>
          <input
            type="text"
            value={formData.ifscCode}
            onChange={(e) => updateFormData("ifscCode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., HDFC0000001"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            UPI ID (Optional)
          </label>
          <input
            type="text"
            value={formData.upiId}
            onChange={(e) => updateFormData("upiId", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="yourname@upi"
          />
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-medium text-green-900 mb-2">
          Bank Account Information:
        </h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Ensure account is in your name</li>
          <li>• Account must be active and functional</li>
          <li>• IFSC code must be 11 characters</li>
          <li>• Commissions will be credited to this account</li>
        </ul>
      </div>
    </div>
  );
}
