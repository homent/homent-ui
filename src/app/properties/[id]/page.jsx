"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Car,
  Wifi,
  Shield,
  Zap,
  Leaf,
  Eye,
  Heart,
  Share2,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from 'sonner';
import SocietyMapPicker from '../../../components/SocietyMapPicker';
import { mapFormToApiBody, mapEditFormToApiBody } from "@/utils/propertyMapper";
import SocietyDropdown from "@/components/SocietyDropdown";

export default function PropertyDetailPage({ params }) {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    address: "",
    city: "",
    state: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    photos: "",
    // additional fields mirrored from create form
    total_floors: "",
    floor_number: "",
    property_age: "",
    built_area: "",
    landmark: "",
    available_from: "",
    preferred_tenants: "",
    furnishing: "",
    parking: "",
    possession_status: "",
    amenities: "",
    uploadedFiles: [],
  });
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (params.id !== "new") fetchProperty();
  }, [params.id]);

  // If we're in creation mode, render the create form immediately (don't wait for fetch)
  if (params.id === "new") {
    return <CreatePropertyForm />;
  }

  const uploadPropertyPhotos = async (propertyId, files) => {
    if (!propertyId || !Array.isArray(files) || files.length === 0) return;

    const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL;

    const formData = new FormData();

    files.forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file);
      }
    });

    const uploadResp = await fetch(
      `${BASE_URL}/homent?userId=1&eventType=ADD_PROPERTY_FILES&propertyId=${propertyId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!uploadResp.ok) {
      const text = await uploadResp.text();
      throw new Error(text || "Photo upload failed");
    }

    toast.success("Photos uploaded successfully");
  };

  // get signle property by id to view details
 const fetchProperty = async () => {
    const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL;
    console.log("API BASE URL 2:", import.meta.env.NEXT_PUBLIC_API_BASE_URL);

  try {
    setLoading(true);
    let loaded = null;

    try {
      const queryParams = new URLSearchParams({
        eventType: "GET_PROPERTY_SINGLE",
        userId: 1,
        status: "Active",
        propertyId: params.id,
      });

      const response = await fetch(
        `${BASE_URL}/homent?${queryParams.toString()}`
      );
      console.log("Fetch property response:", response);
      if (response.ok) {
        const data = await response.json();
        // const list = data?.data || [];
        const normalizedPhotos = Array.isArray(data?.photos)
        ? data.photos.map((p) => p.url).filter(Boolean)
        : [];
        console.log("Fetched property data:", data);
        loaded = {
          ...data,
          photos: data.photos,
        };
        // loaded = data || {};
      } else {
        const stored = JSON.parse(
          localStorage.getItem("mock_properties") || "null"
        );
        loaded = stored
          ? stored.find((p) => String(p.id) === String(params.id))
          : null;
      }
    } catch (err) {
      const stored = JSON.parse(
        localStorage.getItem("mock_properties") || "null"
      );
      loaded = stored
        ? stored.find((p) => String(p.id) === String(params.id))
        : null;
    }

    if (loaded) setProperty(loaded);
  } catch (error) {
    console.error("Error fetching property:", error);
  } finally {
    setLoading(false);
  }
};

  const isVideo = (fileType = "") =>
    ["mp4", "webm", "ogg"].includes(fileType.toLowerCase());

  const isImage = (fileType = "") =>
    ["jpg", "jpeg", "png", "webp", "gif"].includes(fileType.toLowerCase());

  const handleNextImage = () => {
    if (property?.photos) {
      setCurrentImageIndex((prev) => (prev + 1) % property.photos.length);
    }
  };

  const handlePrevImage = () => {
    if (property?.photos) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + property.photos.length) % property.photos.length,
      );
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const openEdit = () => {
    console.log("Opening edit for property:", property);
    if (!property) return;
    const societyDetail = property.societyDetail || {};
    setEditForm({
      societyName: societyDetail.societyName || "",
      title: property.title || "",
      buildYear: societyDetail.buildYear || "",
      address: societyDetail?.address || "",
      city: societyDetail?.city || "",
      state: societyDetail?.state || "",
      price: property.price ? String(property.price) : "",
      bedrooms: property.bedroom ? String(property.bedroom) : "",
      bathrooms: property.bathroom ? String(property.bathroom) : "",
      description: property.description || "",
      photos: property.photos ? property.photos.join(", ") : "",
      total_floors: societyDetail.totalFloor ? String(societyDetail.totalFloor) : "",
      floor_number: property.floor ? String(property.floor) : "",
      property_age: societyDetail.buildYear ? String(new Date().getFullYear() - Number(societyDetail.buildYear)) : "",
      built_area: property.builtArea ? String(property.builtArea) : "",
      landmark: property.landmark || "",
      available_from: property.available_from || "",
      preferred_tenants: property.preferred_tenants || "",
      furnishing: property.furnishStatus || "",
      parking: property.parking !== undefined && property.parking !== null ? String(property.parking) : "",
      possession_status: property.possessionStatus || "",
      amenities: property?.societyDetail?.amenities ? property.societyDetail.amenities.join(", ") : "",
      uploadedFiles: property.photos || [],
      ...property,
    });
    setIsEditing(true);
  };

  const updateEdit = (k, v) => setEditForm((s) => ({ ...s, [k]: v }));

  const getPreviewUrl = (file) => {
    if (!file) return "";
    if (typeof file === "object" && file.url) {
      return file.url;
    }
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return "";
  };

  const getMediaType = (file) => {
    if (file?.fileType) {
      const ext = file.fileType.toLowerCase();
      if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
      if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    }
    if (file?.type) {
      if (file.type.startsWith("image/")) return "image";
      if (file.type.startsWith("video/")) return "video";
    }

    return "other";
  };

  const getFileType = (file) => {
    if (file instanceof File) return file.type;
    if (file?.fileType) {
      return `image/${file.fileType}`;
    }
    return "";
  };

  const getImageSrc = (photo) => {
  if (photo instanceof File) {
    return URL.createObjectURL(photo);
  }
  return photo.url;
};

  const handleEditSubmit = async (e) => {
  e.preventDefault();

  try {
    const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL;

    // 🔹 Build payload with only changed fields
    const payload = mapEditFormToApiBody(editForm, property);

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to update");
      return;
    }

    const response = await fetch(
      `${BASE_URL}/homent?userId=1&eventType=UPDATE_PROPERTY`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const json = await response.json();

    if (!response.ok) {
      throw new Error(json?.message || "Update failed");
    }

    toast.success("Property updated successfully");

    // 🔹 Upload new photos ONLY if selected
    if (editForm.uploadedFiles?.length > 0) {
      await uploadPropertyPhotos(property.id, editForm.uploadedFiles);
    }
    setIsEditing(false);
    fetchProperty();
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Error updating property");
  }
};


  const handleDeleteProperty = () => {
    if (!property) return;
    // open confirm modal
    setShowDeleteConfirm(true);
  };

 const confirmDeleteProperty = async () => {
    if (!property?.id) return;

    const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL;

    try {
      const res = await fetch(
        `${BASE_URL}/homent?userId=1&eventType=DELETE_PROPERTY&propertyId=${property.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      console.log("Delete response:", res);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Delete API failed");
      }
      setShowDeleteConfirm(false);
      navigate("/properties");
      toast.success("Property deleted successfully");

    } catch (err) {
      setShowDeleteConfirm(false);
      console.error("Delete API failed, falling back to local delete", err);
    }

    // 🔹 Always update local storage (fallback / sync)
    try {
      const stored =
        JSON.parse(localStorage.getItem("mock_properties") || "[]") || [];

      const filtered = stored.filter((p) => p.id !== property.id);
      localStorage.setItem("mock_properties", JSON.stringify(filtered));
    } catch (e) {
      console.warn("Local storage cleanup failed", e);
    }
};


  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/property-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: params.id,
          ...inquiryData,
        }),
      });

      if (response.ok) {
        toast.success("Inquiry sent successfully!");
        setInquiryData({ name: "", email: "", phone: "", message: "" });
        setShowInquiryForm(false);
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    } else {
      return price;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <a href="/properties" className="text-blue-600 hover:text-blue-700">
              ← Back to Properties
            </a>
          </div>
        </header>
        <div className="text-center py-12">
          <p className="text-gray-600">Property not found</p>
        </div>
      </div>
    );
  }


  const amenityIcons = {
    "Swimming Pool": Wifi,
    Gym: Zap,
    Security: Shield,
    Garden: Leaf,
    "Power Backup": Zap,
  };

  // Compute activity stats (try to read from localStorage mock data if present)
  const activity = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("mock_properties") || "null");
      const p = Array.isArray(stored) ? stored.find((s) => String(s.id) === String(property.id)) : null;
      const contacted = p?.user_contacts?.length ?? property?.user_contacts?.length ?? p?.contacted_count ?? (p?.contacted ? 1 : (property?.contacted ? 1 : 0));
      const views = p?.views ?? property?.views ?? 0;
      const likes = p?.likes ?? property?.likes ?? 0;
      return { contacted, views, likes };
    } catch (e) {
      return { contacted: property?.user_contacts?.length ?? (property?.contacted ? 1 : 0), views: property?.views || 0, likes: property?.likes || 0 };
    }
  })();

  // Is current viewer a broker? Simple flag controlled via localStorage for now (set user_role='broker' to test)
  const isBroker = (() => {
    try {
      return localStorage.getItem('user_role') === 'broker';
    } catch (e) {
      return false;
    }
  })();

  // Load user contacts for this property (visible only to brokers)
  const userContacts = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mock_properties') || 'null');
      const p = Array.isArray(stored) ? stored.find((s) => String(s.id) === String(property.id)) : null;
      if (p && Array.isArray(p.user_contacts)) return p.user_contacts;
    } catch (e) {
      // ignore
    }
    if (Array.isArray(property?.user_contacts) && property.user_contacts.length > 0) return property.user_contacts;
    // sample test contacts for UI testing
    return [
      { id: 'test_u1', name: 'Aman Gupta', phone: '+91 98765 43210', contactedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
      { id: 'test_u2', name: 'Neha Singh', phone: '+91 91234 56789', contactedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() },
      { id: 'test_u3', name: 'Aman Gupta', phone: '+91 98765 43210', contactedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
      { id: 'test_u4', name: 'Aman Gupta', phone: '+91 98765 43210', contactedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
      { id: 'test_u5', name: 'Aman Gupta', phone: '+91 98765 43210', contactedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },
      { id: 'test_u6', name: 'Aman Gupta', phone: '+91 98765 43210', contactedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() },

    ];
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 w-full text-white bg-blue-600 border-b shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">Homent</span>
          </div>
          <a
            href="/properties"
            className="text-white hover:text-white transition-colors"
          >
            ← Back to Properties
          </a>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-lg overflow-hidden mb-6">
              {property.photos && property.photos.length > 0 ? (
                <>
                  {property.photos && property.photos.length > 0 ? (
                    (() => {
                      const current = property.photos[currentImageIndex];

                      if (isVideo(current.fileType)) {
                        return (
                          <video
                            src={current.url}
                            className="w-full h-full object-cover"
                            controls
                          />
                        );
                      }

                      return (
                        <img
                          src={current.url}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      );
                    })()
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  {property.photos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                      >
                        <ChevronLeft className="h-6 w-6 text-gray-900" />
                        </button>
                        <button
                            onClick={handleNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                          >
                            <ChevronRight className="h-6 w-6 text-gray-900" />
                        </button>
                        <button
                        onClick={openEdit}
                        className="p-3 rounded-full bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors"
                        title="Edit property"
                      >
                        Edit
                      </button>
                      {/* <button
                        onClick={handleDeleteProperty}
                        className="p-3 rounded-full bg-white text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                        title="Delete property"
                      >
                        Delete
                      </button> */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {property.photos.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-white w-6"
                                : "bg-white bg-opacity-50 w-2"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Property Title and Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.societyDetail?.societyName || property.title}
                  </h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>
                      {property.societyDetail?.city}, {property.societyDetail?.state}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className={`p-3 rounded-full ${saved ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"} hover:bg-red-100 hover:text-red-600 transition-colors`}
                    >
                      <Heart
                        className="h-6 w-6"
                        fill={saved ? "currentColor" : "none"}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Share2 className="h-6 w-6" />
                    </button>
                    <button
                      onClick={openEdit}
                      className="bg-blue-600 text-white p-3 rounded-full border border-gray-200 transition-colors"
                      title="Edit property"
                    >
                      Edit
                    </button>
                    <button
                        onClick={handleDeleteProperty}
                        className="p-3 rounded-full bg-white text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                        title="Delete property"
                      >
                        Delete
                    </button>
                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                          <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Delete Property
                          </h2>

                          <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this property?  
                            {/* This action <span className="font-semibold text-red-600">cannot be undone</span>. */}
                          </p>

                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => setShowDeleteConfirm(false)}
                              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                              Cancel
                            </button>

                            <button
                              onClick={confirmDeleteProperty}
                              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                            >
                              Yes, Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {property.dealType === "rent"
                    ? "For Rent"
                    : property.dealType === "new"
                      ? "New Project"
                      : "Resale"}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {property.possessionStatus?.replace("_", " ")}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {property.dealType}
                </span>
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatPrice(property?.price)}
              </div>
              {property.builtArea && (
                <p className="text-gray-600">
                  ₹{Math.round(property.price / property.builtArea)} / sqft
                </p>
              )}
            </div>

            {/* Edit Modal */}
            {isEditing && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-40 overflow-y-auto">
                <div className="flex items-start md:items-center justify-center min-h-screen px-4 py-8">
                  <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Edit Property</h3>
                    <button onClick={() => setIsEditing(false)} className="text-gray-500">Close</button>
                  </div>
                  <form onSubmit={handleEditSubmit} className="space-y-4">

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Society Name</label>
                      <input disabled value={editForm.societyName} onChange={(e) => updateEdit("societyName", e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input value={editForm.title} onChange={(e) => updateEdit("title", e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input disabled value={editForm.address} onChange={(e) => updateEdit("address", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input disabled value={editForm.city} onChange={(e) => updateEdit("city", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input disabled value={editForm.societyDetail.country} onChange={(e) => updateEdit("country", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input disabled value={editForm.state} onChange={(e) => updateEdit("state", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" value={editForm.price} onChange={(e) => updateEdit("price", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                        <input type="number" value={editForm.bedrooms} onChange={(e) => updateEdit("bedrooms", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                        <input type="number" value={editForm.bathrooms} onChange={(e) => updateEdit("bathrooms", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea value={editForm.description} onChange={(e) => updateEdit("description", e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={4} />
                    </div>

                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700">Photos (comma separated URLs)</label>
                      <input value={editForm.photos} onChange={(e) => updateEdit("photos", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                    </div> */}

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Built Up Area (sqft)</label>
                        <input type="number" value={editForm.built_area} onChange={(e) => updateEdit("built_area", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Property Age (years)</label>
                        <input type="number" value={editForm.property_age} onChange={(e) => updateEdit("property_age", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Total Floors</label>
                        <input disabled type="number" value={editForm.total_floors} onChange={(e) => updateEdit("total_floors", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Floor Number</label>
                        <input type="number" value={editForm.floor_number} onChange={(e) => updateEdit("floor_number", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Parking</label>
                        <input type="text" value={editForm.parking} onChange={(e) => updateEdit("parking", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Build Year
                        </label>
                        <input
                          disabled
                          type="number"
                          placeholder="e.g. 2022"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={editForm.societyDetail?.buildYear || ""}
                          onChange={(e) => updateEdit("build_year", e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Available From</label>
                        <input type="date" value={editForm.available_from} onChange={(e) => updateEdit("available_from", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Furnishing</label>
                        <select value={editForm.furnishing} onChange={(e) => updateEdit("furnishing", e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Select</option>
                          <option value="furnished">Furnished</option>
                          <option value="semi_furnished">Semi Furnished</option>
                          <option value="unfurnished">Unfurnished</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Tenants</label>
                        <input value={editForm.preferred_tenants} onChange={(e) => updateEdit("preferred_tenants", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Landmark / Street</label>
                        <input value={editForm.landmark} onChange={(e) => updateEdit("landmark", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Possession Status</label>
                        <select value={editForm.possession_status} onChange={(e) => updateEdit("possession_status", e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Select</option>
                          <option value="ready_to_move">Ready to Move</option>
                          <option value="under_construction">Under Construction</option>
                          <option value="new">New Project</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
                        <input value={editForm.amenities} onChange={(e) => updateEdit("amenities", e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Gym, Swimming Pool, Security" />
                      </div>
                    </div>

                    {/* File upload for photos/videos (edit) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Upload Photos / Video</label>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (!files.length) return;

                          setEditForm((s) => ({
                            ...(s || {}),
                            uploadedFiles: [...(s.uploadedFiles || []), ...files],
                          }));
                          e.target.value = "";
                        }}
                        className="w-full mt-2"
                      />
                      {editForm.uploadedFiles?.length > 0 && (
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {editForm.uploadedFiles.map((file, idx) => {
                          const previewUrl = getPreviewUrl(file);
                          const mediaType = getMediaType(file);
                          return (
                            <div key={idx} className="relative">
                              {mediaType === "image" ? (
                                <img
                                  src={previewUrl}
                                  alt={`upload-${idx}`}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                              ) : mediaType === "video" ? (
                                <video
                                  src={previewUrl}
                                  className="w-full h-32 object-cover rounded-md"
                                  controls
                                />
                              ) : (
                                <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md text-sm text-gray-500">
                                  Unsupported file
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  setEditForm((s) => ({
                                    ...s,
                                    uploadedFiles: s.uploadedFiles.filter((_, i) => i !== idx),
                                  }))
                                }
                                className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 border"
                                title="Remove"
                              >
                                ✕
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    </div>
                    <div className="flex justify-end">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 mr-2 border rounded-lg">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save changes</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            )}

            {/* Property Specifications */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Key Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.bedroom && (
                  <div className="text-center">
                    <Bed className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Bedrooms</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {property.bedroom}
                    </p>
                  </div>
                )}
                {property.bathroom && (
                  <div className="text-center">
                    <Bath className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Bathrooms</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {property.bathroom}
                    </p>
                  </div>
                )}
                {property.parking >= 0 && (
                  <div className="text-center">
                    <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Parking</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {property.parking}
                    </p>
                  </div>
                )}
                {property.builtArea && (
                  <div className="text-center">
                    <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Built Area</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {Math.round(property.builtArea)} sqft
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About this Property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description}
              </p>
            </div>

            {isBroker && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Users Contacted</h3>
                {userContacts && userContacts.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto space-y-3 pr-2" aria-live="polite">
                    {userContacts.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="text-gray-900 font-medium">{u.name}</div>
                          <div className="text-sm text-gray-600">{new Date(u.contactedAt).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 font-medium">{u.phone}</div>
                          <a href={`tel:${u.phone.replace(/\s+/g, '')}`} className="text-sm text-blue-600 hover:underline mt-1 inline-block">Call</a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No user contacts yet.</p>
                )}
              </div>
            )}
            {!isBroker && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Users Contacted</h3>
                <p className="text-sm text-gray-600">Contact details are visible only to verified brokers.</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Amenities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-500 text-white">
                          <Wifi className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-900 font-medium">{amenity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Additional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {property.furnishStatus && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Furnishing</p>
                    <p className="text-gray-900 font-medium">
                      {property.furnishStatus.replace("_", " ")}
                    </p>
                  </div>
                )}
                {property.societyDetail?.buildYear && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Year Built</p>
                    <p className="text-gray-900 font-medium">
                      {property.societyDetail.buildYear}
                    </p>
                  </div>
                )}
                {property.floor && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Floor Number</p>
                    <p className="text-gray-900 font-medium">
                      {property.floor}
                    </p>
                  </div>
                )}
                {property.societyDetail?.totalFloor && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Floors</p>
                    <p className="text-gray-900 font-medium">
                      {property.societyDetail.totalFloor}
                    </p>
                  </div>
                )}
                {property.carpetArea && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Carpet Area</p>
                    <p className="text-gray-900 font-medium">
                      {Math.round(property.carpetArea)} sqft
                    </p>
                  </div>
                )}
                {property.builtArea && (
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Plot Area</p>
                    <p className="text-gray-900 font-medium">
                      {Math.round(property.builtArea)} sqft
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Services (Packers & Movers, Create Agreement) */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="/movers"
                  className="block p-4 border rounded hover:shadow transition-colors bg-white"
                  title="Packers & Movers"
                >
                  <div className="text-lg font-medium">Packers & Movers</div>
                  <div className="text-sm text-gray-600">Get quotes and contact verified movers for shifting assistance.</div>
                </a>

                <a
                  href="/movers/create-agreement"
                  className="block p-4 border rounded hover:shadow transition-colors bg-white"
                  title="Create Agreement"
                >
                  <div className="text-lg font-medium">Create Agreement</div>
                  <div className="text-sm text-gray-600">Generate a rental agreement online.</div>
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Agent
              </h3>
              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Agent
                </button>
                {/* <button className="w-full flex items-center justify-center px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Agent
                </button> */}
              </div>

              {/* Inquiry Form Toggle */}
              <button
                onClick={() => setShowInquiryForm(!showInquiryForm)}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send Inquiry
              </button>

              {/* Inquiry Form */}
              {showInquiryForm && (
                <form
                  onSubmit={handleInquirySubmit}
                  className="mt-6 pt-6 border-t"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={inquiryData.name}
                        onChange={(e) =>
                          setInquiryData({
                            ...inquiryData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={inquiryData.email}
                        onChange={(e) =>
                          setInquiryData({
                            ...inquiryData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={inquiryData.phone}
                        onChange={(e) =>
                          setInquiryData({
                            ...inquiryData,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        value={inquiryData.message}
                        onChange={(e) =>
                          setInquiryData({
                            ...inquiryData,
                            message: e.target.value,
                          })
                        }
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Send Inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Facts
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Address</p>
                  <p className="text-gray-900">{property.societyDetail?.address}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Location</p>
                  <p className="text-gray-900">
                    {property.societyDetail?.city}, {property.societyDetail?.state}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Posted On</p>
                  <p className="text-gray-900">
                    {property.created_at
                      ? new Date(property.created_at).toLocaleDateString()
                      : property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString()
                        : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Property Type</p>
                  <p className="text-gray-900">{property.dealType}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Possession Status</p>
                  <p className="text-gray-900">
                    {property.possessionStatus?.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
            {/* Activity On This Property */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Activity On This Property</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Contacted</p>
                  <p className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    {activity.contacted}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Views</p>
                  <p className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    {activity.views}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Shortlist</p>
                  <p className="text-xl font-semibold text-gray-900 flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    {activity.likes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatePropertyForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    address: "",
    city: "",
    state: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    description: "",
    photos: "",
  // selected society/location from map picker
  society_name: "",
  society_address: "",
  society_lat: undefined,
  society_lon: undefined,
    total_floors: "",
    floor_number: "",
    property_age: "",
    built_area: "",
    landmark: "",
    available_from: "",
    preferred_tenants: "",
    furnishing: "",
    parking: "",
    possession_status: "",
    amenities: "",
    uploadedFiles: [],
  });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

   const uploadPropertyPhotos = async (propertyId, files) => {
    if (!propertyId || !Array.isArray(files) || files.length === 0) return;

    const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL;

    const formData = new FormData();

    files.forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file);
      }
    });

    const uploadResp = await fetch(
      `${BASE_URL}/homent?userId=1&eventType=ADD_PROPERTY_FILES&propertyId=${propertyId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!uploadResp.ok) {
      const text = await uploadResp.text();
      throw new Error(text || "Photo upload failed");
    }

    toast.success("Photos uploaded successfully");
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const payload = mapFormToApiBody(form);
    console.log("Submitting payload:", payload);
    const BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL;

    // API call
    const response = await fetch(`${BASE_URL}/homent?userId=1&eventType=ADD_PROPERTY`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await response.json();
    console.log("API response:", json, response);
    if (response?.status == 200 || response.ok) {
      const propertyId = json?.tempId || json?.id;
      toast.success("Property added successfully!", json);
      // Navigate to the created property detail page
       /* 2️⃣ Upload photos AFTER property success */
      if (propertyId && form.uploadedFiles?.length > 0) {
        await uploadPropertyPhotos(propertyId, form.uploadedFiles);
      }
      navigate(`/properties`);
    } else {
      console.error("API error:", json);
      toast.error(json.error || "Failed to add property");
    }
  } catch (err) {
    console.error("Submit error:", err);
    toast.error("Error submitting property");
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 w-full text-white bg-blue-600 border-b shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-white-600" />
            <span className="text-xl font-bold text-white-900">Homent</span>
          </div>
          <a href="/properties" className="text-white-600 hover:text-white-700 transition-colors">← Back to Properties</a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Add Property</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Society selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Society
              </label>

              <SocietyDropdown
                onSelect={(s) => {
                  setForm((prev) => ({
                    ...prev,
                    societyName: s.societyName,
                    society_address: s.address,
                    city: s.city,
                    country: s.country,
                    societyId: s.id,
                    address: s.address,
                    state: s.state,
                    society_lat: s.latitude,
                    society_lon: s.longitude,
                    total_floors: s.totalFloor,
                    property_age: new Date().getFullYear() - s.buildYear,
                  }));
                }}
              />
              {/* {form.society_name && (
                <div className="mt-2 p-2 border rounded bg-gray-50">
                  <div className="text-sm font-medium">
                    {form.society_name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {form.society_address}
                  </div>
                </div>
              )} */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Society Name</label>
              <input disabled value={form.societyName} onChange={(e) => update("societyName", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input value={form.title} onChange={(e) => update("title", e.target.value)} className="w-full px-3 py-2 border rounded-lg" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input disabled value={form.address} onChange={(e) => update("address", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input disabled value={form.city} onChange={(e) => update("city", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input disabled value={form.country} onChange={(e) => update("country", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <input disabled value={form.state} onChange={(e) => update("state", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Built Up Area (sqft)</label>
                <input type="number" value={form.built_area} onChange={(e) => update("built_area", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Age (years)</label>
                <input type="number" value={form.property_age} onChange={(e) => update("property_age", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Floors</label>
                <input type="number" value={form.total_floors} onChange={(e) => update("total_floors", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Floor Number</label>
                <input type="number" value={form.floor_number} onChange={(e) => update("floor_number", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Parking (count)</label>
                <input type="number" value={form.parking} onChange={(e) => update("parking", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Available From</label>
                <input type="date" value={form.available_from} onChange={(e) => update("available_from", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Furnishing</label>
                <select value={form.furnishing} onChange={(e) => update("furnishing", e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Select</option>
                  <option value="furnished">Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Tenants</label>
                <input value={form.preferred_tenants} onChange={(e) => update("preferred_tenants", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Landmark / Street</label>
                <input value={form.landmark} onChange={(e) => update("landmark", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Possession Status</label>
                <select value={form.possession_status} onChange={(e) => update("possession_status", e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Select</option>
                  <option value="ready_to_move">Ready to Move</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="new">New Project</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
                <input value={form.amenities} onChange={(e) => update("amenities", e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Gym, Swimming Pool, Security" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <input type="number" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                <input type="number" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea value={form.description} onChange={(e) => update("description", e.target.value)} className="w-full px-3 py-2 border rounded-lg" rows={4} />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Photos (comma separated URLs)</label>
              <input value={form.photos} onChange={(e) => update("photos", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div> */}

            {/* Society / location picker */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Select Society / Location</label>
              <SocietyMapPicker
                onSelect={(s) => {
                  // s: { name, address, lat, lon, city }
                  setForm((prev) => ({
                    ...prev,
                    society_name: s.name || prev.society_name,
                    society_address: s.address || prev.society_address,
                    society_lat: s.lat,
                    society_lon: s.lon,
                    city: s.city || prev.city,
                  }));
                }}
              />

              {form.society_name && (
                <div className="mt-2 p-2 border rounded bg-gray-50">
                  <div className="text-sm font-medium">{form.society_name}</div>
                  <div className="text-xs text-gray-600">{form.society_address}</div>
                </div>
              )}
            </div> */}

            {/* File upload for photos/videos */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload Photos / Video
              </label>

              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (!files.length) return;

                  setForm((s) => ({
                    ...(s || {}),
                    uploadedFiles: [...(s.uploadedFiles || []), ...files], // ✅ keep File objects
                  }));

                  // reset input so same file can be selected again
                  e.target.value = "";
                }}
                className="w-full mt-2"
              />

              {/* Preview */}
              {form.uploadedFiles?.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {form.uploadedFiles.map((file, idx) => {
                    const previewUrl = URL.createObjectURL(file);

                    return (
                      <div key={idx} className="relative">
                        {file.type.startsWith("image/") ? (
                          <img
                            src={previewUrl}
                            alt={`upload-${idx}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                        ) : file.type.startsWith("video/") ? (
                          <video
                            src={previewUrl}
                            className="w-full h-32 object-cover rounded-md"
                            controls
                          />
                        ) : (
                          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-md">
                            File
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setForm((s) => ({
                              ...s,
                              uploadedFiles: s.uploadedFiles.filter((_, i) => i !== idx),
                            }))
                          }
                          className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 border"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => navigate('/properties')} className="px-4 py-2 mr-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{saving ? 'Saving...' : 'Create Property'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
