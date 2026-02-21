const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const submitEnquiry = async (eventType, data) => {
  try {
    const response = await fetch(`${BASE_URL}/homent?eventType=${eventType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};