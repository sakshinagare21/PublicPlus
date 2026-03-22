export const detectZone = (lat, lng) => {
  lat = Number(lat);
  lng = Number(lng);

  /* ================= SHIVAJINAGAR ================= */
  if (lat >= 18.52 && lat <= 18.55 && lng >= 73.84 && lng <= 73.87) {
    return "Shivajinagar Zone";
  }

  /* ================= KOTHRUD ================= */
  if (lat >= 18.49 && lat < 18.52 && lng >= 73.80 && lng < 73.84) {
    return "Kothrud Zone";
  }

  /* ================= HADAPSAR ================= */
  if (lat >= 18.47 && lat <= 18.50 && lng >= 73.92 && lng <= 73.97) {
    return "Hadapsar Zone";
  }

  /* ================= BANER ================= */
  if (lat >= 18.55 && lat <= 18.58 && lng >= 73.77 && lng <= 73.80) {
    return "Baner Zone";
  }

  /* ================= WAKAD ================= */
  if (lat >= 18.58 && lat <= 18.62 && lng >= 73.75 && lng <= 73.79) {
    return "Wakad Zone";
  }

  /* ================= VIMAN NAGAR ================= */
  if (lat >= 18.56 && lat <= 18.58 && lng >= 73.90 && lng <= 73.93) {
    return "Viman Nagar Zone";
  }

  /* ================= SINHAGAD ROAD ================= */
  if (lat >= 18.48 && lat <= 18.52 && lng >= 73.82 && lng <= 73.86) {
    return "Sinhagad Road Zone";
  }

  /* ================= CAMP ================= */
  if (lat >= 18.50 && lat <= 18.52 && lng >= 73.87 && lng <= 73.89) {
    return "Camp Zone";
  }

  /* ================= DEFAULT ================= */
  return "General Pune Zone";
};