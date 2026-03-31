/**
 * Detects the zone from a list of zones with boundaries
 * @param {Number} lat 
 * @param {Number} lng 
 * @param {Array} zones 
 * @returns {String} Zone Name
 */
export const detectZone = (lat, lng, zones = []) => {
  if (!zones || zones.length === 0) return "General Pune Sector";

  const latNum = Number(lat);
  const lngNum = Number(lng);

  if (isNaN(latNum) || isNaN(lngNum) || lat === "" || lng === "") return "Analyzing Telemetry...";

  const matchedZone = zones.find(z => {
    // 1. Check explicit boundaries if defined
    const { minLat, maxLat, minLng, maxLng } = z.boundaries || {};
    if (minLat !== undefined && maxLat !== undefined) {
      return (
        latNum >= minLat &&
        latNum <= maxLat &&
        lngNum >= minLng &&
        lngNum <= maxLng
      );
    }

    // 2. Fallback: Radial match (approx 2.5km) using center coordinates
    if (z.coordinates && z.coordinates.lat !== undefined) {
      const dLat = Math.abs(latNum - z.coordinates.lat);
      const dLng = Math.abs(lngNum - z.coordinates.lng);
      return (dLat < 0.025 && dLng < 0.025);
    }

    return false;
  });

  return matchedZone ? matchedZone.areaName : "Outside Boundaries";
};
