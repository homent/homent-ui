// utils/propertyMapper.js

/**
 * Map form data to API request body for ADD_PROPERTY (without photos)
 * @param {Object} form - Form values
 * @returns {Object} API request body
 */
export const mapFormToApiBody = (form) => ({
  dealType: form.listing_type?.toUpperCase() || "RESALE", // RENT or RESALE
  visibilityType: form.visibilityType || "ALL", // ALL, ORG, ME
  title: form.title || "test",
  societyName: form.societyName,
  description: form.description || "test description",
  status: "Active",
  type: form.property_type?.toUpperCase() || "FLAT", // FLAT, VILLA, etc
  price: form.price ? Number(form.price) : 0,
  builtArea: form.built_area ? Number(form.built_area) : 0,
  carpetArea: form.carpet_area || "200",
  unit: form.unit || "2",
  bedroom: form.bedrooms ? Number(form.bedrooms) : 0,
  bathroom: form.bathrooms ? Number(form.bathrooms) : 0,
  furnishStatus: form.furnishing || "test",
  parking: form.parking ? form.parking.toString() : "0",
  floor: form.floor_number ? form.floor_number.toString() : "0",
  facing: form.facing || "North",
  possessionStatus: form.possession_status || "Ready to Move",
  flatNo: form.flat_no || "202",
  wing: form.wing || "A",
  societyId: form.societyId, // society ID
});


/**
 * Map API response property to internal mock format
 * @param {Object} apiProperty
 * @returns {Object} mapped property
 */
export const mapApiPropertyToMock = (apiProperty) => ({
  id: apiProperty.id ?? crypto.randomUUID(),
  title: apiProperty.title ?? "",
  address: apiProperty.societyDetail?.address ?? "",
  city: apiProperty.societyDetail?.city ?? "",
  state: apiProperty.societyDetail?.state ?? "",
  price: Number(apiProperty.price) || 0,
  bedrooms: Number(apiProperty.bedroom) || 0,
  bathrooms: Number(apiProperty.bathroom) || 0,
  description: apiProperty.description ?? "",
  photos: apiProperty.photos || [],
  listing_type: apiProperty.dealType?.toLowerCase() || "resale",
  possession_status: apiProperty.possessionStatus
    ?.toLowerCase()
    .replace(/\s+/g, "_") || "ready_to_move",
  property_type: apiProperty.type?.toLowerCase() || "apartment",
  built_area: Number(apiProperty.builtArea) || 0,
  total_floors: Number(apiProperty.societyDetail?.totalFloor) || 0,
  floor_number: Number(apiProperty.floor) || 0,
  year_built: Number(apiProperty.societyDetail?.buildYear) || null,
  landmark: "",
  available_from: null,
  preferred_tenants: "Any",
  furnishing: apiProperty.furnishStatus
    ? apiProperty.furnishStatus.includes("FF")
      ? "furnished"
      : apiProperty.furnishStatus.includes("SS")
      ? "semi_furnished"
      : "unfurnished"
    : "unfurnished",
  parking:
    typeof apiProperty.parking === "string"
      ? apiProperty.parking.includes("2")
        ? 2
        : 1
      : 0,
  amenities: Array.isArray(apiProperty.societyDetail?.amenities)
    ? apiProperty.societyDetail.amenities
        .flatMap((a) =>
          typeof a === "string"
            ? a.replace(/[\[\]]/g, "").split(",")
            : []
        )
        .map((a) => a.trim())
    : [],
  contacted: false,
  user_contacts: [],
  ...apiProperty,
});

/**
 * Map multiple API properties to mock format
 * @param {Array} apiProperties
 * @returns {Array} mapped properties
 */
export const mapApiPropertiesToMock = (apiProperties) => {
  return apiProperties.map(mapApiPropertyToMock);
};

export const mapEditFormToApiBody = (form, originalProperty) => {
  const payload = {
    id: originalProperty.id,
  };
  const setIfChanged = (key, value, original) => {
    if (
      value !== undefined &&
      value !== "" &&
      String(value) !== String(original)
    ) {
      payload[key] = value;
    }
  };

  // 🔹 Property fields
  setIfChanged("price", Number(form.price), originalProperty.price);
  setIfChanged("price", Number(form.price), originalProperty.title);
  setIfChanged("builtArea", Number(form.built_area), originalProperty.builtArea);
  setIfChanged("bedroom", Number(form.bedrooms), originalProperty.bedroom);
  setIfChanged("bathroom", Number(form.bathrooms), originalProperty.bathroom);
  setIfChanged("floor", Number(form.floor_number), originalProperty.floor);
  setIfChanged("parking", Number(form.parking), originalProperty.parking);
  setIfChanged("furnishStatus", form.furnishing, originalProperty.furnishStatus);
  setIfChanged(
    "possessionStatus",
    form.possession_status,
    originalProperty.possessionStatus
  );
  setIfChanged("description", form.description, originalProperty.description);

  // 🔹 Society change it as per the socity 
  // if (form.title && form.title !== originalProperty?.societyDetail?.societyName) {
    // payload.societyDetail = { societyName: form.title };
  // }

  if (form.landmark && form.landmark !== originalProperty.landmark) {
    payload.landmark = form.landmark;
  }
  payload.status = originalProperty.status || "Active";
  return payload;
};


