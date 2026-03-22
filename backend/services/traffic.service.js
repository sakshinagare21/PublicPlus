import axios from "axios";

export const getTrafficLevel = async (lat, lng) => {
  try {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    if (!API_KEY) {
      console.log("Missing Google API Key");
      return { level: "unknown", ratio: 0 };
    }

    /* ================= VALIDATE INPUT ================= */
    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return { level: "unknown", ratio: 0 };
    }

    /* ================= DESTINATION ================= */
    const destLat = parsedLat + 0.01;
    const destLng = parsedLng + 0.01;

    /* ================= API URL ================= */
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

    const response = await axios.get(url, {
      params: {
        origins: `${parsedLat},${parsedLng}`,
        destinations: `${destLat},${destLng}`,
        departure_time: "now",
        key: API_KEY,
      },
      timeout: 5000, // prevent hanging
    });

    const element = response.data?.rows?.[0]?.elements?.[0];

    if (!element || element.status !== "OK") {
      return { level: "unknown", ratio: 0 };
    }

    /* ================= TIMES ================= */
    const normalTime = element.duration?.value;
    const trafficTime = element.duration_in_traffic?.value;

    if (!normalTime || !trafficTime) {
      return { level: "unknown", ratio: 0 };
    }

    /* ================= RATIO ================= */
    const ratio = trafficTime / normalTime;

    /* ================= LEVEL ================= */
    let level = "low";

    if (ratio >= 1.5) level = "high";
    else if (ratio >= 1.2) level = "medium";

    return {
      level,
      ratio: Number(ratio.toFixed(2)),
    };

  } catch (error) {
    console.log("Traffic API error:", error.response?.data || error.message);

    return {
      level: "unknown",
      ratio: 0,
    };
  }
};