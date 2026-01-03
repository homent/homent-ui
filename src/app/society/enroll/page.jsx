"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import Select from 'react-select'
import { countries, states, cities, apartmentTypeOptions } from './../../services/constant';
import { enrollSociety, uploadSocietyFiles } from './../../services/society';

export default function EnrollSocietyPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    apartmentType: "", // required
    city: "",
    apartmentName: "",
    bhkType: "",
    floorNumber: "",
    totalFloors: "",
    propertyAge: "",
    facing: "",
    builtUpArea: "",
    landmark: "",
    // other optional notes
    notes: "",
    builderName: "",
    address: "",
    pincode: "",
    state: "",
    country: "",
    buildYear: "",
    amenities: "",
    completionDate: "",
    latitude: "",
    longitude: "",
    uploadedFiles: [],
  });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.apartmentType || form.apartmentType.trim() === "") {
      toast.error("Apartment Type is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        builderName: form.builderName || undefined,
        societyName: form.apartmentName || undefined,
        completionDate: form.completionDate || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        pincode: form.pincode ? Number(form.pincode) : undefined,
        state: form.state || undefined,
        country: form.country || undefined,
        latitude: form.latitude || undefined,
        longitude: form.longitude || undefined,
        amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()) : [],
        totalFloor: form.totalFloors ? Number(form.totalFloors) : undefined,
        buildYear: form.buildYear ? Number(form.buildYear) : undefined,
      };

      const response = await enrollSociety(payload);
      const societyId = response?.id || response?.tempId;

      // Upload photos after successful enrollment
      if (societyId && form.uploadedFiles?.length > 0) {
        await uploadSocietyFiles(societyId, form.uploadedFiles);
      }

      toast.success("Society enrolled successfully");
      // small delay so user sees toast, then navigate back to properties list
      setTimeout(() => navigate("/societies"), 700);
    } catch (err) {
      console.error(err);
      toast.error("Failed to enroll society");
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
            <span className="text-xl font-bold text-white-900">Enroll Society</span>
          </div>
          <a href="/properties" className="text-white-600 hover:text-white-700">← Back to Properties</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">Enroll Society</h2>
          <p className="text-sm text-gray-600 mb-4">Provide society/apartment details. Fields marked * are required.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <Select
                options={states}
                value={states.find(state => state.value === form.state) || null}
                onChange={(selectedOption) =>
                  update('state', selectedOption?.value || null)
                }
                placeholder="Select state"
                isClearable
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
                <Select
                  options={countries}
                  value={countries.find(country => country.value === form.country) || null}
                  onChange={(selectedOption) =>
                    update('country', selectedOption?.value || null)
                  }
                  placeholder="Select country"
                  isClearable
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <Select
                options={cities}
                value={cities.find(city => city.value === form.city) || null}
                onChange={(selectedOption) =>
                  update('city', selectedOption?.value || null)
                }
                placeholder="Select city"
                isClearable
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Apartment Type *</label>
              <Select
                options={apartmentTypeOptions}
                value={apartmentTypeOptions.find(option => option.value === form.apartmentType) || null}
                onChange={(selectedOption) =>
                  update('apartmentType', selectedOption?.value || null)
                }
                placeholder="Select apartment type"
                isClearable
              />
              {/* <select value={form.apartmentType} onChange={(e) => update("apartmentType", e.target.value)} required className="w-full px-3 py-2 border rounded-lg">
                <option value="">Select apartment type</option> */}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Society Name</label>
              <input value={form.apartmentName} placeholder="Enter society name" onChange={(e) => update("apartmentName", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Builder Name</label>
              <input value={form.builderName} placeholder="Enter builder name" onChange={(e) => update("builderName", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Completion Date</label>
              <input type="date" value={form.completionDate} onChange={(e) => update("completionDate", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Society Address</label>
              <input value={form.address} placeholder="Enter society address" onChange={(e) => update("address", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input type="number" placeholder="Enter pincode" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input type="text" placeholder="Enter latitude" value={form.latitude} onChange={(e) => update("latitude", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input type="text" placeholder="Enter longitude" value={form.longitude} onChange={(e) => update("longitude", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">BHK Type</label>
                <select value={form.bhkType} onChange={(e) => update("bhkType", e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Select</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4+ BHK">4+ BHK</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Facing</label>
                <select value={form.facing} onChange={(e) => update("facing", e.target.value)} className="w-full px-3 py-2 border rounded-lg">
                  <option value="">Select</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="North-East">North-East</option>
                  <option value="North-West">North-West</option>
                  <option value="South-East">South-East</option>
                  <option value="South-West">South-West</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Floor</label>
                <input type="number" value={form.floorNumber} onChange={(e) => update("floorNumber", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Floors</label>
                <input type="number" value={form.totalFloors} onChange={(e) => update("totalFloors", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Build Year</label>
                <input type="number" placeholder="buildYear" value={form.buildYear} onChange={(e) => update("buildYear", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Built Up Area (sqft)</label>
                <input type="number" value={form.builtUpArea} onChange={(e) => update("builtUpArea", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Landmark / Street</label>
                <input value={form.landmark} onChange={(e) => update("landmark", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Amenities (comma separated)</label>
                <input value={form.amenities} onChange={(e) => update("amenities", e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="Gym, Swimming Pool, Security" />
              </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
              <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg" />
            </div>

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
              <button type="button" onClick={() => navigate('/societies')} className="px-4 py-2 mr-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{saving ? 'Saving...' : 'Enroll Society'}</button>
            </div>
          </form>
        </div>

        {/* <div className="mt-6 text-sm text-gray-600">Saved societies are stored locally (localStorage key: <code>enrolled_societies</code>).</div> */}
      </main>
    </div>
  );
}
