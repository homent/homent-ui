"use client";
import { useRouter  } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Car,
  Heart,
  Share2,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from 'sonner';
import SiteHeader from "../components/SiteHeader";
import { mapApiPropertiesToMock, mapEditFormToApiBody } from "../../utils/propertyMapper";


export default function PropertiesPage() {
  const SAMPLE_PROPERTIES = [
    {
      id: "1",
      title: "Spacious 3BHK in City Center",
      description: "A bright, airy 3 bedroom apartment close to transit and parks.",
      price: 8500000,
      city: "Mumbai",
      state: "Maharashtra",
      photos: [],
      listing_type: "resale",
      possession_status: "ready_to_move",
      property_type: "apartment",
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      built_area: 1200,
      amenities: ["Gym", "Swimming Pool"],
    },
  ];
  const [isBroker, setIsBroker] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    listingType: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    city: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Reset pagination when filters change
    setCurrentPage(0);
    setHasMore(true);
    fetchProperties(0, false);
  }, [filters]);

    useEffect(() => {
    const role = localStorage.getItem("role");
    setIsBroker(role === "broker");
  }, []);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (loadingMore || !hasMore) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Load more when user is within 200px of bottom
      if (scrollTop + windowHeight >= documentHeight - 200) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchProperties(nextPage, true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, loadingMore, hasMore]);

  // Fetch properties from API with applied filters
  const fetchProperties = async (page = 0, append = false) => {
 const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    if (!append) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    // Base query params required by new API
    const queryParams = new URLSearchParams({
      eventType: "GET_PROPERTY",
      // userId: 1,
      status: "Active",
      pageNumber: page,
      pageSize: 20,
    });

    // Append dynamic filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    let data = null;

    try {
      const response = await fetch(
        `${BASE_URL}/homent?${queryParams.toString()}`
      );

      if (response.ok) {
        const json = await response.json();
        const apiData = json || [];
        console.log("API Data:", apiData);
        data = mapApiPropertiesToMock(apiData);
        console.log("Mapped Properties:", data);
      } else {
        const stored = JSON.parse(
          localStorage.getItem("mock_properties") || "null"
        );
        data = stored || SAMPLE_PROPERTIES;
      }
    } catch (err) {
      const stored = JSON.parse(
        localStorage.getItem("mock_properties") || "null"
      );
      data = stored || SAMPLE_PROPERTIES;
    }

    
    const processedData = (data || []).map((p) => ({ ...p, contacted: !!p.contacted }));

    if (append) {
      setProperties(prev => [...prev, ...processedData]);
      setHasMore(processedData.length === 20);
    } else {
      setProperties(processedData);
      setHasMore(processedData.length === 20);
    }
  } catch (error) {
    console.error("Error fetching properties:", error);
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};


  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      listingType: "",
      propertyType: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      city: "",
      search: "",
    });
    setCurrentPage(0);
    setHasMore(true);
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b">
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
              <a
                href="/partner/register"
                className="bg-orange-custom text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Become Partner
              </a>
            </nav>
          </div>
        </div>
      </header> */}
      <SiteHeader title="Properties" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative search-properties">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search properties by title, location..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border btn-border-color rounded-lg focus:btn-border-color"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border properties-text-color border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
              <div  className="mt-2">
                <a
                  href="/properties/new"
                  className="px-4 py-2 mr-2 btn-bg-color text-white rounded-lg"
                >
                  Add Property
                </a>
                {isBroker && (
                  <div>
                    <a
                    href="/societies"
                    className="px-4 py-2 mr-2 btn-bg-color text-white rounded-lg"
                  >
                    View Societies
                  </a>
                  <a
                    href="/society/enroll"
                    className="px-4 py-2 mr-2 btn-bg-color text-white rounded-lg"
                  >
                    Enroll Society
                  </a>
                  </div>
                 )}
            </div> 
      
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t">
              <select
                value={filters.listingType}
                onChange={(e) => updateFilter("listingType", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Types</option>
                <option value="rent">Rent</option>
                <option value="new">New</option>
                <option value="resale">Resale</option>
              </select>

              <select
                value={filters.propertyType}
                onChange={(e) => updateFilter("propertyType", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="independent_house">Independent House</option>
                <option value="plot">Plot</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <select
                value={filters.bedrooms}
                onChange={(e) => updateFilter("bedrooms", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>

              <input
                type="text"
                placeholder="City"
                value={filters.city}
                onChange={(e) => updateFilter("city", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                onClick={clearFilters}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 properties-text-color">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium properties-text-color mb-2">
              No properties found
            </h3>
            <p className="properties-text-color">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onContacted={(id, ownerDetails) => {
                setProperties((prev) => prev.map((pp) => pp.id === id ? { ...pp, contacted: true, ownerDetails } : pp));
              }} />
            ))}
          </div>
        )}

        {/* Loading indicator for infinite scroll */}
        {loadingMore && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading more properties...</p>
          </div>
        )}

        {/* End of results indicator */}
        {!loading && !loadingMore && !hasMore && properties.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">You've reached the end of the list.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PropertyCard({ property, onContacted }) {
  const navigate = useRouter();
  const [saved, setSaved] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNameError, setContactNameError] = useState("");
  const [contactPhoneError, setContactPhoneError] = useState("");
  const [otpEntered, setOtpEntered] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sentOtp, setSentOtp] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactUseWhatsApp, setContactUseWhatsApp] = useState(false);
  const [contactCountryCode, setContactCountryCode] = useState("+91");
  const [otpError, setOtpError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);
  const isValidName = (name) => /^[a-zA-Z\s]*$/.test(name) && name.trim().length > 0;
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSave = async () => {
    setSaved(!saved);
  };
  const handleShare = () => {
    setShareModalOpen(true);
  };

  const validateContactName = (name) => {
    if (!name.trim()) {
      setContactNameError("Name is required");
      return false;
    }
    if (!isValidName(name)) {
      setContactNameError("Name should only contain letters and spaces");
      return false;
    }
    setContactNameError("");
    return true;
  };

  const validateContactPhone = (phone) => {
    if (!phone) {
      setContactPhoneError("Phone number is required");
      return false;
    }
    if (!isValidPhone(phone)) {
      setContactPhoneError("Enter a valid 10-digit mobile number starting with 6-9");
      return false;
    }
    setContactPhoneError("");
    return true;
  };

  const sendOtp = async () => {
    setContactNameError("");
    setContactPhoneError("");

    if (!validateContactName(contactName) | !validateContactPhone(contactNumber)) {
      return;
    }

    setContactLoading(true);
    setOtpError("");
    setOtpVerified(false);

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await fetch(
        `${BASE_URL}/homent?eventType=ADD_CUSTOMER_ENQUIRY`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contactName,
            phone: contactNumber,
            enquiryType: property.listing_type || "Rent",
            propertyId: property.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.message || "Failed to send OTP");
        return;
      }

      toast.success("OTP sent successfully");
      setOtpSent(true);
      setResendTimer(30); // ⏳ 30 sec cooldown
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while sending OTP");
    } finally {
      setContactLoading(false);
    }
  };

  const handleContact = async () => {
    const userDetailsRaw = localStorage.getItem("userLoginDetails");
    const userDetails = JSON.parse(userDetailsRaw);
    console.log("userDetails", userDetails);

    if (userDetails?.id) {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

        const response = await fetch(
          `${BASE_URL}/homent?eventType=ADD_CUSTOMER_SERVICE_ENQUIRY`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: userDetails?.name,
              email: userDetails?.email,
              phone: userDetails?.phone,
              enquiryType: property.listing_type || " ",
              propertyId: property.id,
              userId: userDetails?.id,
            }),
          }
        );

        const result = await response.json();

        if (!response.ok) {
          toast.error(result?.message || "Failed to contact owner");
          return;
        }
        toast.success("Owner contacted successfully");
        onContacted?.(property.id, { ownerName: result?.name, ownerMobile: result?.mobile });
        setContactModalOpen(false);
        return;
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
        return;
      }
    }

    setContactCountryCode("+91");
    setContactName("");
    setContactNameError("");
    setContactPhoneError("");
    setOtpEntered("");
    setOtpSent(false);
    setSentOtp(null);
    setContactUseWhatsApp(false);
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setContactNumber("");
    setContactName("");
    setContactNameError("");
    setContactPhoneError("");
    setOtpEntered("");
    setOtpSent(false);
    setSentOtp(null);
    setContactLoading(false);
    setContactUseWhatsApp(false);
    setContactCountryCode("+91");
    setOtpError("");
    setOtpVerified(false);
  };

  const verifyOtp = async () => {
    if (!otpEntered) {
      setOtpError("Please enter OTP");
      return;
    }

    setContactLoading(true);
    setOtpError("");

    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(
        `${BASE_URL}/homent?eventType=CUSTOMER_OTP_VERIFY&mobile=${contactNumber}&otp=${otpEntered}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: contactName,
            phone: contactNumber,
            enquiryType: property.listing_type || "Rent",
            propertyId: property.id,
          }),
        }
      );
      const json = await res.json();
      if (!res.ok || json?.status === 400) {
        setOtpError("Invalid OTP. Please try again.");
        setOtpVerified(false);
        return;
      }
      localStorage.setItem(
        "userLoginDetails",
        JSON.stringify(json)
      );

      toast.success("Phone verified successfully");
      handleContact();
      setOtpVerified(true);
      onContacted?.(property.id);
      closeContactModal();
    } catch (e) {
      console.error(e);
      setOtpError("Invalid OTP. Please try again.");
      setOtpVerified(false);
    } finally {
      setContactLoading(false);
    }
  };

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: "", email: "", phone: "", message: "" });
  const [inquiryErrors, setInquiryErrors] = useState({ name: "", email: "", phone: "" });
  const [inquiryCountryCode, setInquiryCountryCode] = useState("+91");
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const handleInquiry = async () => {
    const userDetailsRaw = localStorage.getItem("userLoginDetails");
    const userDetails = JSON.parse(userDetailsRaw);
    console.log("userDetails inquiry", userDetails);

    const raw = userDetails?.phone || "";
    let phone = raw || "";
    if (phone && phone.startsWith("+")) {
      const m = phone.match(/^\+\d{1,4}/);
      if (m) {
        setInquiryCountryCode(m[0]);
        phone = phone.slice(m[0].length).replace(/[^0-9]/g, "");
      }
    } else {
      setInquiryCountryCode("+91");
    }
    setInquiryData({ name: userDetails?.name || "", email: userDetails?.email || "", phone, message: "", id: userDetails?.id });
    setInquiryErrors({ name: "", email: "", phone: "" });
    setShowInquiryForm(true);
  };

  const closeInquiryForm = () => {
    setShowInquiryForm(false);
    setInquiryData({ name: "", email: "", phone: "", message: "" });
    setInquiryErrors({ name: "", email: "", phone: "" });
    setInquiryLoading(false);
    setInquiryCountryCode("+91");
  };

  const validateInquiryForm = () => {
    const errors = { name: "", email: "", phone: "" };
    let isValid = true;

    if (!inquiryData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (!isValidName(inquiryData.name)) {
      errors.name = "Name should only contain letters and spaces";
      isValid = false;
    }

    if (!inquiryData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!isValidEmail(inquiryData.email)) {
      errors.email = "Enter a valid email address";
      isValid = false;
    }

    if (!inquiryData.phone.trim()) {
      errors.phone = "Phone is required";
      isValid = false;
    } else if (!isValidPhone(inquiryData.phone)) {
      errors.phone = "Enter a valid 10-digit mobile number starting with 6-9";
      isValid = false;
    }

    setInquiryErrors(errors);
    return isValid;
  };

  const handleInquirySubmit = async (e) => {
    e && e.preventDefault && e.preventDefault();
    console.log("Submitting inquiry:", inquiryData);

    if (!validateInquiryForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setInquiryLoading(true);
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

      const response = await fetch(
        `${BASE_URL}/homent?eventType=ADD_CUSTOMER_SERVICE_ENQUIRY`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: inquiryData.name,
            email: inquiryData.email,
            phone: inquiryData.phone,
            message: inquiryData.message,
            enquiryType: "enquiry",
            propertyId: property.id,
            userId: inquiryData?.id,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result?.message || "Failed to send inquiry");
        return;
      }
      toast.success("Inquiry sent successfully");
      closeInquiryForm();
    } catch (error) {
      console.error("Inquiry submit error:", error);
      toast.error("Failed to send inquiry");
    } finally {
      setInquiryLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const getListingTypeBadge = (type) => {
    const colors = {
      rent: "bg-green-100 text-green-800",
      new: "bg-blue-100 text-blue-800",
      resale: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        {property.photos && property.photos.length > 0 ? (
          <div
            onClick={() => navigate.push(`/properties/${property.id}`)}
            className="cursor-pointer block w-full h-full"
          >
            <img
              src={property.photos[0].url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div onClick={() => navigate.push(`/properties/${property.id}`)} className="w-full h-full flex items-center justify-center block">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 properties-text-color rounded-full text-xs font-medium ${getListingTypeBadge(property.listing_type)}`}
          >
            {property.listing_type?.charAt(0).toUpperCase() +
              property.listing_type?.slice(1)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full bg-white ${saved ? "text-red-500" : "text-gray-600"} hover:text-red-500 transition-colors`}
          >
            <Heart 
              className={`h-6 w-6 ${saved ? "text-red-500" : "text-gray-600"}`}
              fill={saved ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* Status Badge */}
        {property.possession_status && (
          <div className="absolute bottom-3 left-3">
            <span className="px-2 py-1 bg-white bg-opacity-90 rounded text-xs font-medium text-gray-800">
              {property.possession_status
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold properties-text-color line-clamp-2">
            <div
              onClick={() => navigate.push(`/properties/${property.id}`)}
              className="cursor-pointer"
            >
              <span className="hover:underline">{property?.societyDetail?.societyName || property.title}</span>
            </div>
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold properties-text-color">
              {formatPrice(property.price)}
            </div>
            {property.built_area && (
              <div className="text-sm properties-text-color">
                ₹{Math.round(property.price / property.built_area)} / sqft
              </div>
            )}
          </div>
        </div>

        <p className="properties-text-color font-weight-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>

        {/* Property Specs */}
        <div className="flex items-center space-x-4 mb-3 text-xs properties-text-color font-weight-600">
          {property.bedrooms && (
            <div className="flex items-center bg-orange-50 px-2 py-1 rounded">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} BHK
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center bg-orange-50 px-2 py-1 rounded">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms}
            </div>
          )}
          {property.parking > 0 && (
            <div className="flex items-center bg-orange-50 px-2 py-1 rounded">
              <Car className="h-4 w-4 mr-1" />
              {property.parking}
            </div>
          )}
          {property.built_area && (
            <div className="bg-orange-50 px-2 py-1 rounded">{property.built_area} sqft</div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-sm properties-text-color font-weight-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">
            {property.city}, {property.state}
          </span>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 items-center">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-orange-50 text-orange-800 rounded text-xs"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-2 py-1 bg-orange-50 text-orange-800 rounded text-xs">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {localStorage.getItem("role") !== "broker" && property.contacted && (
          <div className="mb-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Contacted Owner
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-full shadow">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Owner Name</p>
                  <p className="font-medium text-gray-800">
                    {property.ownerDetails?.ownerName || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-white rounded-full shadow">
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Owner Mobile</p>
                  <p className="font-medium text-gray-800">
                    {property.ownerDetails?.ownerMobile || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {localStorage.getItem("role") === "broker" && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 items-center">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                None Contacted
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            disabled={property.contacted}
            onClick={handleContact}
            className="flex-1 flex items-center justify-center px-3 py-2 btn-bg-color text-white rounded-lg hover:btn-bg-color transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Phone className="h-4 w-4 mr-1" />
            Contact Owner
          </button>
          <button
            onClick={handleInquiry}
            className="flex-1 flex items-center justify-center px-3 py-2 border btn-border-color btn-text-color-secondary rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            <Mail className="h-4 w-4 mr-1" />
            Inquire
          </button>
        </div>
      </div>

      {/* Contact Owner Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeContactModal} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold properties-text-color mb-4">Contact Owner</h3>

            <label className="block text-sm properties-text-color mb-2">Your name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => {
                setContactName(e.target.value);
                setContactNameError(""); // Clear error on change
              }}
              onBlur={() => validateContactName(contactName)}
              disabled={otpSent}
              className={`w-full px-3 py-2 border rounded mb-1 ${contactNameError ? "border-red-500" : ""}`}
              placeholder="Enter your name"
            />
            {contactNameError && (
              <p className="text-sm text-red-600 mb-3">{contactNameError}</p>
            )}

            <label className="block text-sm properties-text-color mb-2">Phone number</label>
            <div className="mb-1">
              <div className="flex">
                <input
                  id={`wa-cc-${property.id}`}
                  type="text"
                  value={contactCountryCode}
                  onChange={(e) => setContactCountryCode(e.target.value)}
                  className="w-20 px-3 py-2 border border-r-0 rounded-l-md bg-white text-sm font-bold"
                />
                <input
                  type="tel"
                  disabled={otpSent}
                  value={contactNumber}
                  onChange={(e) => {
                    setContactNumber(e.target.value);
                    setContactPhoneError(""); // Clear error on change
                  }}
                  onBlur={() => validateContactPhone(contactNumber)}
                  className={`flex-1 px-3 py-2 border rounded-r-md ${contactPhoneError ? "border-red-500" : ""}`}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            {contactPhoneError && (
              <p className="text-sm text-red-600 mb-3">{contactPhoneError}</p>
            )}

            <div className="flex items-center mb-3">
              <label htmlFor={`wa-toggle-${property.id}`} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id={`wa-toggle-${property.id}`}
                    type="checkbox"
                    checked={contactUseWhatsApp}
                    onChange={(e) => setContactUseWhatsApp(e.target.checked)}
                    disabled={otpSent}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${contactUseWhatsApp ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${contactUseWhatsApp ? 'translate-x-5' : ''}`} />
                </div>
                <span className="ml-3 text-sm properties-text-color">Send OTP via WhatsApp</span>
              </label>
            </div>

            {!otpSent && (
              <p className="text-xs text-gray-500 mb-3">OTP text field will appear after sending OTP</p>
            )}

            {otpSent && (
              <>
                <label className="block text-sm properties-text-color mb-2">OTP</label>
                <input
                  type="text"
                  value={otpEntered}
                  onChange={(e) => {
                    setOtpEntered(e.target.value);
                    setOtpError("");
                  }}
                  className={`w-full px-3 py-2 border rounded mb-1 ${
                    otpError ? "border-red-500" : ""
                  }`}
                  placeholder="Enter received OTP"
                />
                {otpError && (
                  <p className="text-sm text-red-600 mb-3">{otpError}</p>
                )}
              </>
            )}

            <div className="flex items-center justify-between gap-2 mt-4">
              <button
                onClick={otpSent ? verifyOtp : sendOtp}
                disabled={contactLoading || (!otpSent && !isValidPhone(contactNumber))}
                className={`btn-bg-color text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {otpSent
                  ? contactLoading ? "Verifying..." : "Submit"
                  : contactLoading ? "Sending..." : "Send OTP"}
              </button>
              {otpSent && (
                <button
                  onClick={sendOtp}
                  disabled={resendTimer > 0 || contactLoading}
                  className="text-sm properties-text-color disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0
                    ? `Resend in ${resendTimer}s`
                    : "Resend OTP"}
                </button>
              )}
              <button onClick={closeContactModal} className="px-4 py-2 text-sm properties-text-color">Cancel</button>
            </div>
            <p className="text-xs properties-text-color mt-3">We will send a one-time code to verify your phone.</p>
          </div>
        </div>
      )}

      {/* Inquiry Form Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeInquiryForm} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Send Inquiry</h3>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={inquiryData.name}
                  onChange={(e) => {
                    setInquiryData((s) => ({ ...s, name: e.target.value }));
                    if (inquiryErrors.name) setInquiryErrors((s) => ({ ...s, name: "" }));
                  }}
                  className={`w-full px-3 py-2 border rounded ${inquiryErrors.name ? "border-red-500" : ""}`}
                  placeholder="Enter your name"
                />
                {inquiryErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{inquiryErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={inquiryData.email}
                  onChange={(e) => {
                    setInquiryData((s) => ({ ...s, email: e.target.value }));
                    if (inquiryErrors.email) setInquiryErrors((s) => ({ ...s, email: "" }));
                  }}
                  className={`w-full px-3 py-2 border rounded ${inquiryErrors.email ? "border-red-500" : ""}`}
                />
                {inquiryErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{inquiryErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="flex">
                  <input
                    id={`inq-cc-${property.id}`}
                    type="text"
                    value={inquiryCountryCode}
                    onChange={(e) => setInquiryCountryCode(e.target.value)}
                    className="w-20 px-3 py-2 border border-r-0 rounded-l-md bg-white text-sm font-bold"
                  />
                  <input
                    type="tel"
                    value={inquiryData.phone}
                    onChange={(e) => {
                      setInquiryData((s) => ({ ...s, phone: e.target.value }));
                      if (inquiryErrors.phone) setInquiryErrors((s) => ({ ...s, phone: "" }));
                    }}
                    className={`flex-1 px-3 py-2 border rounded-r-md ${inquiryErrors.phone ? "border-red-500" : ""}`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {inquiryErrors.phone && (
                  <p className="text-sm text-red-600 mt-1">{inquiryErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData((s) => ({ ...s, message: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Additional details about your inquiry"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className={`px-4 py-2 bg-orange-custom text-white rounded ${inquiryLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {inquiryLoading ? 'Sending...' : 'Send Inquiry'}
                </button>
                <button
                  type="button"
                  onClick={closeInquiryForm}
                  className="px-4 py-2 text-sm text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShareModalOpen(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold properties-text-color mb-4">Share Property</h3>
            <p className="text-sm text-gray-600 mb-4">Choose how you'd like to share this property:</p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  const url = `https://teams.microsoft.com/share?url=${encodeURIComponent(window.location.href)}&msg=${encodeURIComponent(`${property.title}\n${property.description}`)}`;
                  window.open(url, '_blank');
                  setShareModalOpen(false);
                }}
                className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">T</span>
                </div>
                <span className="text-sm font-medium">Share via Microsoft Teams</span>
              </button>

              <button
                onClick={() => {
                  const subject = encodeURIComponent(property.title);
                  const body = encodeURIComponent(`${property.description}\n\n${window.location.href}`);
                  const url = `mailto:?subject=${subject}&body=${body}`;
                  window.open(url, '_blank');
                  setShareModalOpen(false);
                }}
                className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">O</span>
                </div>
                <span className="text-sm font-medium">Share via Outlook</span>
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                  setShareModalOpen(false);
                }}
                className="w-full flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-400 rounded mr-3 flex items-center justify-center">
                  <span className="text-white text-sm">📋</span>
                </div>
                <span className="text-sm font-medium">Copy Link</span>
              </button>
            </div>

            <button
              onClick={() => setShareModalOpen(false)}
              className="mt-4 w-full px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}