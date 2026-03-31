import Zone from "../models/zone.model.js";

/**
 * Dynamically detects the municipal zone from database boundaries
 * @param {Number} lat 
 * @param {Number} lng 
 * @returns {Promise<String>} Zone Name
 */
export const detectZone = async (lat, lng) => {
  try {
    const latNum = Number(lat);
    const lngNum = Number(lng);

    // Find zone where coordinates fall within boundaries
    const zone = await Zone.findOne({
      "boundaries.minLat": { $lte: latNum },
      "boundaries.maxLat": { $gte: latNum },
      "boundaries.minLng": { $lte: lngNum },
      "boundaries.maxLng": { $gte: lngNum }
    });

    if (zone) {
      return zone.areaName;
    }

    return "General Pune Zone";
  } catch (error) {
    console.error("Zone Detection Error:", error);
    return "General Pune Zone";
  }
};