"use client";

import { useState, useEffect } from "react";
import { Building2, Calculator, FileText, Download } from "lucide-react";
import Select from 'react-select'
import { countries, states, cities } from '../services/constant';

export default function CostCalculatorPage() {
  const [formData, setFormData] = useState({
    propertyPrice: "",
    propertyType: "residential",
    state: "Maharashtra",
    city: "Pune",
    includeBrokerage: false,
    brokeragePercent: "2",
    isFemale: false,
  });

  const [calculation, setCalculation] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRates();
  }, [formData.state, formData.city, formData.propertyType]);

  const fetchRates = async () => {
    try {
      const response = await fetch(
        `/api/calculator/rates?state=${formData.state}&city=${formData.city}&propertyType=${formData.propertyType}`,
      );
      if (response.ok) {
        const data = await response.json();
        setRates(data.rates);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  const calculateCosts = async () => {
    if (!formData.propertyPrice || !rates) return;

    setLoading(true);
    try {
      const response = await fetch("/api/calculator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setCalculation(data.calculation);
      }
    } catch (error) {
      console.error("Error calculating costs:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const downloadReport = () => {
    if (!calculation) return;

    // Create a simple text report
    const report = `
Property Cost Calculation Report
================================

Property Details:
- Property Price: ${formatCurrency(parseFloat(formData.propertyPrice))}
- Property Type: ${formData.propertyType}
- Location: ${formData.city}, ${formData.state}
- Female Buyer: ${formData.isFemale ? "Yes" : "No"}

Cost Breakdown:
- Base Property Price: ${formatCurrency(calculation.basePrice)}
- Stamp Duty: ${formatCurrency(calculation.stampDuty)} (${rates?.stamp_duty_percent}%)
- Registration Fee: ${formatCurrency(calculation.registrationFee)} (${rates?.registration_percent}%)
${calculation.metroCess ? `- Metro Cess: ${formatCurrency(calculation.metroCess)} (${rates?.metro_cess_percent}%)` : ""}
${calculation.femaleDiscount ? `- Female Discount: -${formatCurrency(calculation.femaleDiscount)} (${rates?.female_discount_percent}%)` : ""}
${calculation.brokerage ? `- Brokerage: ${formatCurrency(calculation.brokerage)} (${formData.brokeragePercent}%)` : ""}

Total Cost: ${formatCurrency(calculation.totalCost)}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "property-cost-calculation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Homent
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </a>
              {/* <a
                href="/properties"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Properties
              </a> */}
              <a
                href="/partner/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Become Partner
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <Calculator className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Property Cost Calculator
          </h1>
          <p className="text-gray-600">
            Calculate stamp duty, registration fees, and total property costs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Property Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Price *
                </label>
                <input
                  type="number"
                  value={formData.propertyPrice}
                  onChange={(e) =>
                    updateFormData("propertyPrice", e.target.value)
                  }
                  placeholder="Enter property price in ₹"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) =>
                    updateFormData("propertyType", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="plot">Plot</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <Select
                  options={states}
                  value={states.find(state => state.value === formData.state) || null}
                  onChange={(selectedOption) => {
                    updateFormData('state', selectedOption?.value || '');
                    // Reset city when state changes
                    updateFormData('city', '');
                  }}
                  placeholder="Select state"
                  isClearable
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
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

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="includeBrokerage"
                  checked={formData.includeBrokerage}
                  onChange={(e) =>
                    updateFormData("includeBrokerage", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="includeBrokerage"
                  className="ml-2 text-sm text-gray-700"
                >
                  Include Brokerage
                </label>
              </div>

              {formData.includeBrokerage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brokerage Percentage
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.brokeragePercent}
                    onChange={(e) =>
                      updateFormData("brokeragePercent", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFemale"
                  checked={formData.isFemale}
                  onChange={(e) => updateFormData("isFemale", e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isFemale"
                  className="ml-2 text-sm text-gray-700"
                >
                  Female buyer (eligible for discount in some states)
                </label>
              </div>

              <button
                onClick={calculateCosts}
                disabled={!formData.propertyPrice || loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Calculating..." : "Calculate Costs"}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Cost Breakdown
              </h2>
              {calculation && (
                <button
                  onClick={downloadReport}
                  className="flex items-center px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              )}
            </div>

            {!calculation ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Enter property details and click calculate to see cost
                  breakdown
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Property Price</span>
                    <span className="font-semibold">
                      {formatCurrency(calculation.basePrice)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Stamp Duty ({rates?.stamp_duty_percent}%)
                    </span>
                    <span className="text-red-600">
                      +{formatCurrency(calculation.stampDuty)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Registration Fee ({rates?.registration_percent}%)
                    </span>
                    <span className="text-red-600">
                      +{formatCurrency(calculation.registrationFee)}
                    </span>
                  </div>

                  {calculation.metroCess > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Metro Cess ({rates?.metro_cess_percent}%)
                      </span>
                      <span className="text-red-600">
                        +{formatCurrency(calculation.metroCess)}
                      </span>
                    </div>
                  )}

                  {calculation.femaleDiscount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Female Discount ({rates?.female_discount_percent}%)
                      </span>
                      <span className="text-green-600">
                        -{formatCurrency(calculation.femaleDiscount)}
                      </span>
                    </div>
                  )}

                  {calculation.brokerage > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Brokerage ({formData.brokeragePercent}%)
                      </span>
                      <span className="text-red-600">
                        +{formatCurrency(calculation.brokerage)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Cost
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(calculation.totalCost)}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Additional Costs to Consider:
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Home loan processing fees</li>
                    <li>• Property insurance</li>
                    <li>• Legal verification charges</li>
                    <li>• Society maintenance deposits</li>
                    <li>• Interior and furnishing costs</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Understanding Property Costs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Stamp Duty</h4>
              <p>
                A tax levied by state governments on property transactions.
                Rates vary by state and property type.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Registration Fee
              </h4>
              <p>
                Fee paid to register the property in your name with the local
                registrar office.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Metro Cess</h4>
              <p>
                Additional tax in certain metro cities to fund infrastructure
                development.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Female Discount
              </h4>
              <p>
                Some states offer reduced stamp duty rates for female property
                buyers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
