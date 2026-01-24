"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter  } from "next/navigation";
import { Building2, MapPin, ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from 'sonner';
import SiteHeader from "../../components/SiteHeader";
import { getSocietyById, deleteSociety } from '../../services/society';

export default function SocietyDetailPage() {
  const { id } = useParams();
  const navigate = useRouter();
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchSociety();
  }, [id]);

  const fetchSociety = async () => {
    try {
      setLoading(true);
      const societyData = await getSocietyById(id);
      if (societyData) {
        setSociety(societyData);
      } else {
        toast.error("Society not found");
        navigate.push("/societies");
      }
    } catch (error) {
      console.error("Error fetching society:", error);
      toast.error("Failed to load society");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSociety(id);
      toast.success("Society deleted successfully");
      navigate.push("/societies");
    } catch (error) {
      console.error("Error deleting society:", error);
      toast.error("Failed to delete society");
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader title="Society Details" Icon={Building2} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading society...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!society) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader title="Society Details" Icon={Building2} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Society not found</h3>
            <button
              onClick={() => navigate.push("/societies")}
              className="px-4 py-2 bg-orange-custom text-white rounded-lg"
            >
              Back to Societies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Society Details" Icon={Building2} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate.push("/societies")}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Societies
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => navigate.push(`/societies/${id}/edit`)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Society
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Society
          </button>
        </div>

        {/* Society Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {society.societyName || society.apartmentName}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Builder Name:</span> {society.builderName}
                </div>
                <div>
                  <span className="font-medium">Society Name:</span> {society.societyName || society.apartmentName}
                </div>
                <div>
                  <span className="font-medium">Address:</span> {society.address}
                </div>
                <div>
                  <span className="font-medium">City:</span> {society.city}
                </div>
                <div>
                  <span className="font-medium">State:</span> {society.state}
                </div>
                <div>
                  <span className="font-medium">Country:</span> {society.country}
                </div>
                <div>
                  <span className="font-medium">Pincode:</span> {society.pincode}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Total Floors:</span> {society.totalFloor}
                </div>
                <div>
                  <span className="font-medium">Build Year:</span> {society.buildYear}
                </div>
                <div>
                  <span className="font-medium">Completion Date:</span> {society.completionDate}
                </div>
                <div>
                  <span className="font-medium">Latitude:</span> {society.latitude}
                </div>
                <div>
                  <span className="font-medium">Longitude:</span> {society.longitude}
                </div>
                <div>
                  <span className="font-medium">Amenities:</span> {society.amenities?.join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Society</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this society? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}