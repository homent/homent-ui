// locationOptions.js

export const countries = [
  { value: 'IN', label: 'India' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
];

export const states = [
  { value: 'MH', label: 'Maharashtra'},
  { value: 'KA', label: 'Karnataka'},
  { value: 'DL', label: 'Delhi'},
  { value: 'TN', label: 'Tamil Nadu'},
  { value: 'TG', label: 'Telangana' },
  { value: 'WB', label: 'West Bengal' },
  { value: 'GJ', label: 'Gujarat'},
];

export const cities = [
  { value: 'Mumbai', label: 'Mumbai', state: 'MH' },
  { value: 'Pune', label: 'Pune', state: 'MH' },
  { value: 'Bengaluru', label: 'Bengaluru', state: 'KA' },
  { value: 'Delhi', label: 'Delhi', state: 'DL' },
  { value: 'Chennai', label: 'Chennai', state: 'TN' },
  { value: 'Hyderabad', label: 'Hyderabad', state: 'TG' },
  { value: 'Kolkata', label: 'Kolkata', state: 'WB' },
  { value: 'Ahmedabad', label: 'Ahmedabad', state: 'GJ' },
];

export const furnishingOptions = [
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi_furnished', label: 'Semi-Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
];


export const tenantOptions = [
  { value: 'any', label: 'Any' },
  { value: 'bachelors', label: 'Bachelors' },
  { value: 'family', label: 'Family' },
];

export const possessionStatusOptions = [
  { value: 'ready_to_move', label: 'Ready to Move' },
  { value: 'under_construction', label: 'Under Construction' },
];


export const apartmentTypeOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'independent_house', label: 'Independent House' },
    { value: 'villa', label: 'Villa' },
    { value: 'gated_community', label: 'Gated Community' },
]