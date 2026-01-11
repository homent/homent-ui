"use client";
import { useNavigate } from "react-router-dom";
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
import SiteHeader from "@/components/SiteHeader";
import { mapApiPropertiesToMock, mapEditFormToApiBody } from "@/utils/propertyMapper";


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
  const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL;;
console.log("API BASE URL 1:", import.meta.env.NEXT_PUBLIC_API_BASE_URL);

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

        // data = (json?.data || []).map(mapApiPropertyToMock);
        console.log("Fetched properties:", data);
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

    // ensure each property has a `contacted` flag
    const processedData = (data || []).map((p) => ({ ...p, contacted: !!p.contacted }));

    if (append) {
      setProperties(prev => [...prev, ...processedData]);
      // Check if we got less than pageSize results, indicating no more data
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search properties by title, location..."
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <a
              href="/properties/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Add Property
            </a>
            <a
              href="/societies"
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              View Societies
            </a>
            <a
              href="/society/enroll"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Enroll Society
            </a>
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
            <p className="mt-2 text-gray-600">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onContacted={(id) => {
                setProperties((prev) => prev.map((pp) => pp.id === id ? { ...pp, contacted: true } : pp));
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
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [otpEntered, setOtpEntered] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sentOtp, setSentOtp] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactUseWhatsApp, setContactUseWhatsApp] = useState(false);
  const [contactCountryCode, setContactCountryCode] = useState("+91");

  const handleSave = async () => {
    setSaved(!saved);
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href,
      });
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleContact = () => {
    // Open contact modal and prefill phone if available
    const rawPhone = property.phone || property.contact_phone || property.agent?.phone || property.agent_phone || "";
    let phone = rawPhone;
    // If phone includes an international code like +91..., split it
    if (phone && phone.startsWith("+")) {
      const codeMatch = phone.match(/^\+\d{1,4}/);
      if (codeMatch) {
        setContactCountryCode(codeMatch[0]);
        phone = phone.slice(codeMatch[0].length).trim().replace(/[^0-9]/g, "");
      }
    } else {
      setContactCountryCode("+91");
    }
    setContactNumber(phone);
    setContactName("");
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
    setOtpEntered("");
    setOtpSent(false);
    setSentOtp(null);
    setContactLoading(false);
    setContactUseWhatsApp(false);
    setContactCountryCode("+91");
  };

  const submitContact = async () => {
    // Single-button flow: if OTP not sent -> send OTP, else verify
    if (!contactNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    if (!otpSent) {
      // "send" OTP (client-side simulation)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(code);
      setOtpSent(true);
      const fullNumber = `${contactCountryCode}${contactNumber}`;
      if (contactUseWhatsApp) {
        toast.success(`OTP sent via WhatsApp to ${fullNumber}`);
        // eslint-disable-next-line no-console
        console.debug("Sent OTP via WhatsApp:", code, fullNumber);
      } else {
        toast.success(`OTP sent to ${fullNumber}`);
        // eslint-disable-next-line no-console
        console.debug("Sent OTP via SMS:", code, fullNumber);
      }
      // In a real app, call backend to send SMS/WhatsApp here
      return;
    }

    // Verify OTP
    setContactLoading(true);
    try {
      if (otpEntered !== sentOtp) {
        toast.error("Invalid OTP");
        return;
      }

      // Mark verified; copy phone to clipboard as action
      if (navigator.clipboard && navigator.clipboard.writeText) {
        const fullNumber = `${contactCountryCode}${contactNumber}`;
        await navigator.clipboard.writeText(fullNumber);
        toast.success("Phone copied to clipboard");
      }
      // notify parent that this property was contacted
      if (typeof onContacted === 'function') onContacted(property.id);

      // Persist contacted flag and record user contact in local mock storage so it survives reloads
      try {
        const fullNumber = `${contactCountryCode}${contactNumber}`;
        const storedRaw = localStorage.getItem("mock_properties");
        if (storedRaw) {
          const stored = JSON.parse(storedRaw);
          if (Array.isArray(stored)) {
            const updated = stored.map((p) => {
              if (p.id === property.id) {
                const prevContacts = Array.isArray(p.user_contacts) ? p.user_contacts : [];
                const newContact = { id: `u_${Date.now()}`, name: contactName || 'Anonymous', phone: fullNumber, contactedAt: new Date().toISOString() };
                return { ...p, contacted: true, user_contacts: [...prevContacts, newContact] };
              }
              return p;
            });
            localStorage.setItem("mock_properties", JSON.stringify(updated));
          }
        } else {
          // create a small mock list containing this property with a user_contacts entry
          const newContact = { id: `u_${Date.now()}`, name: contactName || 'Anonymous', phone: `${contactCountryCode}${contactNumber}`, contactedAt: new Date().toISOString() };
          localStorage.setItem("mock_properties", JSON.stringify([{ ...property, contacted: true, user_contacts: [newContact] }]));
        }
      } catch (e) {
        // ignore localStorage errors
        // eslint-disable-next-line no-console
        console.warn("Failed to persist contacted flag:", e);
      }

      toast.success("Phone verified — you can now contact the owner");
      closeContactModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify phone");
    } finally {
      setContactLoading(false);
    }
  };

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({ name: "", email: "", phone: "", message: "" });
  const [inquiryCountryCode, setInquiryCountryCode] = useState("+91");
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const handleInquiry = () => {
    // Open inquiry modal and prefill phone if available
    const raw = property?.phone || property?.contact_phone || property?.agent?.phone || property?.agent_phone || "";
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
    setInquiryData((d) => ({ ...d, phone }));
    setShowInquiryForm(true);
  };

  const closeInquiryForm = () => {
    setShowInquiryForm(false);
    setInquiryData({ name: "", email: "", phone: "", message: "" });
    setInquiryLoading(false);
    setInquiryCountryCode("+91");
  };

  const handleInquirySubmit = async (e) => {
    e && e.preventDefault && e.preventDefault();
    // minimal validation
    if (!inquiryData.name || !inquiryData.email || !inquiryData.phone) {
      toast.error("Name, email and phone are required");
      return;
    }
    setInquiryLoading(true);
    try {
      // Send inquiry to backend update latter
      const resp = await fetch(`/api/property-inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          name: inquiryData.name,
          email: inquiryData.email,
          phone: `${inquiryCountryCode}${inquiryData.phone}`,
          message: inquiryData.message,
          inquiryType: "general",
        }),
      });

      const json = await resp.json();
      if (resp.ok) {
        toast.success(json.message || "Inquiry sent successfully");
        closeInquiryForm();
      } else {
        toast.error(json.error || "Failed to send inquiry");
      }
    } catch (err) {
      console.error("Inquiry submit error:", err);
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
          // <a href={`/properties/${property.id}`} >
             <div
              onClick={() => navigate(`/properties/${property.id}`)}
              className="cursor-pointer block w-full h-full"
            >
            <img
              src={property.photos[0].url}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            </div>
        ) : (
          <div onClick={() => navigate(`/properties/${property.id}`)} className="w-full h-full flex items-center justify-center block">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Listing Type Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getListingTypeBadge(property.listing_type)}`}
          >
            {property.listing_type?.charAt(0).toUpperCase() +
              property.listing_type?.slice(1)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleSave}
            className={`p-2 rounded-full ${saved ? "bg-red-500 text-white" : "bg-white text-gray-600"} hover:bg-red-500 hover:text-white transition-colors`}
          >
            <Heart className="h-4 w-4" />
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
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            <div
              onClick={() => navigate(`/properties/${property.id}`)}
              className="cursor-pointer"
            >
              <span className="hover:underline">{property?.societyDetail?.societyName || property.title}</span>
            </div>
            {/* <a href={`/properties/${property.id}`} className="hover:underline">{property.title}</a> */}
          </h3>
          <div className="text-right">
            <div className="text-xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </div>
            {property.built_area && (
              <div className="text-sm text-gray-500">
                ₹{Math.round(property.price / property.built_area)} / sqft
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>

        {/* Property Specs */}
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} BHK
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms}
            </div>
          )}
          {property.parking > 0 && (
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              {property.parking}
            </div>
          )}
          {property.built_area && (
            <div className="text-xs">{property.built_area} sqft</div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
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
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        {/* user */}
        {(localStorage.getItem("user_role") != "broker" && property.contacted) && (
          <div className="mb-4">
              <div className="flex flex-wrap gap-1 items-center">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    Contacted Owner
                  </span>
              </div>
          </div>
        )} 
        {/* broker */}
        {  localStorage.getItem("user_role") === "broker" && (
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
            onClick={handleContact}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Phone className="h-4 w-4 mr-1" />
            Contact Owner
          </button>
          <button
            onClick={handleInquiry}
            className="flex-1 flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            <Mail className="h-4 w-4 mr-1" />
            Inquire
          </button>
        </div>
      </div>
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeContactModal} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>

            <label className="block text-sm text-gray-700 mb-2">Your name</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-3"
              placeholder="Enter your name"
            />

            <label className="block text-sm text-gray-700 mb-2">Phone number</label>
            <div className="flex mb-3">
              <input
                id={`wa-cc-${property.id}`}
                type="text"
                value={contactCountryCode}
                onChange={(e) => setContactCountryCode(e.target.value)}
                className="w-20 px-3 py-2 border border-r-0 rounded-l-md bg-white text-sm"
              />
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-r-md"
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex items-center mb-3">
              <label htmlFor={`wa-toggle-${property.id}`} className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    id={`wa-toggle-${property.id}`}
                    type="checkbox"
                    checked={contactUseWhatsApp}
                    onChange={(e) => setContactUseWhatsApp(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${contactUseWhatsApp ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${contactUseWhatsApp ? 'translate-x-5' : ''}`} />
                </div>
                <span className="ml-3 text-sm text-gray-700">Send OTP via WhatsApp</span>
              </label>
            </div>

            <label className="block text-sm text-gray-700 mb-2">OTP</label>
            <input
              type="text"
              value={otpEntered}
              onChange={(e) => setOtpEntered(e.target.value)}
              className="w-full px-3 py-2 border rounded mb-3"
              placeholder={otpSent ? "Enter received OTP" : "(Press Submit to send OTP)"}
            />

            <div className="flex items-center justify-between">
              <button
                onClick={submitContact}
                disabled={contactLoading}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${contactLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {otpSent ? (contactLoading ? 'Verifying...' : 'Submit') : 'Send OTP'}
              </button>
              <button onClick={closeContactModal} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            </div>
            <p className="text-xs text-gray-500 mt-3">We will send a one-time code to verify your phone.</p>
          </div>
        </div>
      )}
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
                  onChange={(e) => setInquiryData((s) => ({ ...s, name: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={inquiryData.email}
                  onChange={(e) => setInquiryData((s) => ({ ...s, email: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="flex">
                  <input
                    id={`inq-cc-${property.id}`}
                    type="text"
                    value={inquiryCountryCode}
                    onChange={(e) => setInquiryCountryCode(e.target.value)}
                    className="w-20 px-3 py-2 border border-r-0 rounded-l-md bg-white text-sm"
                  />
                  <input
                    type="tel"
                    value={inquiryData.phone}
                    onChange={(e) => setInquiryData((s) => ({ ...s, phone: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded-r-md"
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData((s) => ({ ...s, message: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <button type="submit" disabled={inquiryLoading} className={`px-4 py-2 bg-blue-600 text-white rounded ${inquiryLoading ? 'opacity-60 cursor-not-allowed' : ''}`}>
                  {inquiryLoading ? 'Sending...' : 'Send Inquiry'}
                </button>
                <button type="button" onClick={closeInquiryForm} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
