"use client";

import { useState, lazy, Suspense } from "react";

const MapContent = lazy(() =>
  import("./MapContent").then((mod) => ({
    default: mod.default,
  }))
);

export default function SocietyMapPicker({ onSelect, initial }) {
  const [showMap, setShowMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(initial?.place || null);

  const handleSelectFromMap = (placeData) => {
    setSelectedPlace(placeData);
    if (onSelect) {
      onSelect(placeData);
    }
  };

  return (
    <div className="bg-white rounded-md p-4 border">
      <h3 className="text-sm font-semibold mb-2">Search Society / Location</h3>

      <div className="mb-3 space-y-2">
        <input
          type="text"
          placeholder="Enter society name or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />

        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="w-full px-3 py-2 bg-orange-custom text-white rounded-lg text-sm hover:bg-blue-700"
        >
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>

      {showMap && (
        <Suspense fallback={<div className="text-center py-4 text-gray-500">Loading map...</div>}>
          <div className="mb-3 h-64 rounded-lg overflow-hidden border">
            <MapContent onSelect={handleSelectFromMap} />
          </div>
        </Suspense>
      )}

      {selectedPlace && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm font-semibold text-green-900 mb-1">Selected Location:</div>
          <div className="text-sm text-green-800">{selectedPlace.name || selectedPlace.address}</div>
          {selectedPlace.lat && selectedPlace.lon && (
            <div className="text-xs text-green-700 mt-1">
              Lat: {selectedPlace.lat}, Lon: {selectedPlace.lon}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
