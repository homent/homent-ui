"use client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from 'sonner';
import SiteHeader from "@/components/SiteHeader";
import { getSocieties, deleteSociety } from '@/app/services/society';

export default function SocietiesPage() {
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [societyToDelete, setSocietyToDelete] = useState(null);

  useEffect(() => {
    fetchSocieties();
  }, [filters]);

  const fetchSocieties = async () => {
    try {
      setLoading(true);
      const data = await getSocieties({
        userId: 1,
        status: "Active",
        pageNumber: 0,
        pageSize: 20,
      });
      setSocieties(data || []);
    } catch (error) {
      console.error("Error fetching societies:", error);
      toast.error("Failed to load societies");
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      search: "",
    });
  };

  const handleDelete = (societyId) => {
    setSocietyToDelete(societyId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!societyToDelete) return;
    try {
      await deleteSociety(societyToDelete);
      toast.success("Society deleted successfully");
      fetchSocieties(); // Refresh list
    } catch (error) {
      console.error("Error deleting society:", error);
      toast.error("Failed to delete society");
    } finally {
      setShowDeleteModal(false);
      setSocietyToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader title="Societies" Icon={Building2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search societies by name, location..."
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
              href="/society/enroll"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Enroll Society
            </a>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
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

        {/* Societies Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading societies...</p>
          </div>
        ) : societies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No societies found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {societies.map((society) => (
              <SocietyCard key={society.id} society={society} onDelete={handleDelete} />
            ))}
          </div>
        )}
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

function SocietyCard({ society, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Society Image Placeholder */}
      <div className="relative h-48 bg-gray-200">
        <div className="w-full h-full flex items-center justify-center">
          <Building2 className="h-12 w-12 text-gray-400" />
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={() => navigate(`/societies/${society.id}`)}
            className="p-2 rounded-full bg-white text-gray-600 hover:bg-blue-500 hover:text-white transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/societies/${society.id}/edit`)}
            className="p-2 rounded-full bg-white text-gray-600 hover:bg-green-500 hover:text-white transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(society.id)}
            className="p-2 rounded-full bg-white text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Society Details */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {society.societyName || society.apartmentName}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{society.address}, {society.city}</span>
        </div>
        <div className="text-sm text-gray-600">
          <p>Builder: {society.builderName}</p>
          <p>Total Floors: {society.totalFloor}</p>
          <p>Build Year: {society.buildYear}</p>
        </div>
      </div>
    </div>
  );
}