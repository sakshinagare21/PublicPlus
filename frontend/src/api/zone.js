import axios from "axios";

/**
 * Detects the zone by calling the backend API
 * @param {Number} lat 
 * @param {Number} lng 
 * @param {String} token 
 * @returns {Promise<String>} Zone Name
 */
export const detectZone = async (lat, lng, token) => {
  const latNum = Number(lat);
  const lngNum = Number(lng);

  if (isNaN(latNum) || isNaN(lngNum) || lat === "" || lng === "") return "Analyzing Telemetry...";

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/zones/detect`, {
      params: { lat: latNum, lng: lngNum },
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.data.zoneName;
  } catch (error) {
    console.error("Zone Detection API Error:", error);
    return "General Zone";
  }
};
