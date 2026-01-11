// Partner Registration API Services
// Contains all API calls for the partner registration flow

const API_BASE_URL = import.meta.env.NEXT_PUBLIC_API_BASE_URL + "/homent";


/**
 * API call for Step 1: Basic Details
 * @param {Object} formData - Form data from the registration form
 * @returns {Promise<Object>} - API response with userId
 */
export const callBasicDetailsAPI = async (formData) => {
  try {
    // Format date from YYYY-MM-DD to DD-MM-YYYY
    const formatDate = (dateString) => {
      if (!dateString) return undefined;
      const [year, month, day] = dateString.split('-');
      return `${day}-${month}-${year}`;
    };

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      countryCode: formData.countryCode,
      mobile: formData.mobile,
      email: formData.email,
      gender: formData.gender,
      dob: formatDate(formData.dateOfBirth),
      address: formData.address,
      password: formData.password,
      city: formData.city || undefined,
      pincode: formData.pincode ? parseInt(formData.pincode) : undefined,
      state: formData.state || undefined,
      country: formData.country || undefined,
    };

    const response = await fetch(`${API_BASE_URL}?eventType=ADD_USER_BROKER`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to submit basic details");
    }

    const data = await response.json();
    return { success: true, userId: data.userId || data.data?.userId || data.id || data.data?.id };
  } catch (err) {
    console.error("Basic details API error:", err);
    return { success: false, error: err.message || "Failed to submit basic details" };
  }
};

/**
 * API call for Step 2: Work Details
 * @param {Object} formData - Form data from the registration form
 * @returns {Promise<Object>} - API response
 */
export const callWorkDetailsAPI = async (formData, userId) => {
  try {
    const payload = {
      totalExperience: parseInt(formData.totalExperience),
      servingAreas: formData.servingAreas.join(", "),
      specialization: formData.specialization || undefined,
      id: userId,
    };

    const response = await fetch(`${API_BASE_URL}?eventType=ADD_BROKER_WORK_DETAIL`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to submit work details");
    }

    return { success: true };
  } catch (err) {
    console.error("Work details API error:", err);
    return { success: false, error: err.message || "Failed to submit work details" };
  }
};

/**
 * API call for Step 3: Documents Upload
 * @param {Object} formData - Form data containing file objects
 * @param {string} userId - User ID from Step 1
 * @returns {Promise<Object>} - API response
 */
export const callDocumentsAPI = async (formData, userId) => {
  try {
    if (!userId) {
      return { success: false, error: "User ID not found. Please complete basic details first." };
    }

    const documentTypes = [
      { file: formData.aadharFront, docType: "AADHAR_FRONT" },
      { file: formData.aadharBack, docType: "AADHAR_BACK" },
      { file: formData.panLicense, docType: "PAN" },
      { file: formData.drivingLicense, docType: "DRIVING" },
      { file: formData.photo, docType: "PHOTO" },
    ];

    for (const doc of documentTypes) {
      if (doc.file) {
        const formDataObj = new FormData();
        formDataObj.append("files", doc.file);

        const response = await fetch(
          `${API_BASE_URL}?eventType=ADD_BROKER_DOCUMENT&docType=${doc.docType}&userId=${userId}`,
          {
            method: "PUT",
            body: formDataObj,
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || `Failed to upload ${doc.docType}`);
        }
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Documents API error:", err);
    return { success: false, error: err.message || "Failed to upload documents" };
  }
};

/**
 * API call for Step 4: Bank Details
 * @param {Object} formData - Form data from the registration form
 * @param {string} userId - User ID from Step 1
 * @returns {Promise<Object>} - API response
 */
export const callBankDetailsAPI = async (formData, userId) => {
  try {
    const payload = {
      bankName: formData.bankName || undefined,
      accountHoldersName: formData.bankingName || undefined,
      accountNumber: formData.bankAccountNumber || undefined,
      ifscNumber: formData.ifscCode || undefined,
      upiId: formData.upiId || undefined,
      userId: userId || undefined,
      customerType: "BROKER"
    };

    const response = await fetch(`${API_BASE_URL}?eventType=ADD_BROKER_BANK_DETAIL`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to submit bank details");
    }

    return { success: true };
  } catch (err) {
    console.error("Bank details API error:", err);
    return { success: false, error: err.message || "Failed to submit bank details" };
  }
};