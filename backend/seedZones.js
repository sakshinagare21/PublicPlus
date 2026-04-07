import mongoose from "mongoose";
import dotenv from "dotenv";
import Zone from "./models/zone.model.js";
import Issue from "./models/issue.model.js";
import Department from "./models/department.model.js";

dotenv.config();

const zonesMetadata = [
  {
    zoneId: "Z-SHI-001",
    areaName: "Shivajinagar Zone",
    coordinates: { lat: 18.5308, lng: 73.8474 },
    boundaries: { minLat: 18.5200, maxLat: 18.5400, minLng: 73.8350, maxLng: 73.8600 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-DEC-002",
    areaName: "Deccan Zone",
    coordinates: { lat: 18.5159, lng: 73.8412 },
    boundaries: { minLat: 18.5050, maxLat: 18.5250, minLng: 73.8250, maxLng: 73.8500 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-CAM-003",
    areaName: "Camp Zone",
    coordinates: { lat: 18.5191, lng: 73.8760 },
    boundaries: { minLat: 18.5000, maxLat: 18.5200, minLng: 73.8650, maxLng: 73.8900 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-SWA-004",
    areaName: "Swargate Zone",
    coordinates: { lat: 18.5011, lng: 73.8627 },
    boundaries: { minLat: 18.4900, maxLat: 18.5100, minLng: 73.8500, maxLng: 73.8750 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },

  {
    zoneId: "Z-KOT-005",
    areaName: "Kothrud Zone",
    coordinates: { lat: 18.5099, lng: 73.8072 },
    boundaries: { minLat: 18.4900, maxLat: 18.5200, minLng: 73.7900, maxLng: 73.8200 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-KAR-006",
    areaName: "Karve Nagar Zone",
    coordinates: { lat: 18.4898, lng: 73.8203 },
    boundaries: { minLat: 18.4700, maxLat: 18.5000, minLng: 73.8050, maxLng: 73.8350 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-WAR-007",
    areaName: "Warje Zone",
    coordinates: { lat: 18.4867, lng: 73.7919 },
    boundaries: { minLat: 18.4650, maxLat: 18.5050, minLng: 73.7700, maxLng: 73.8050 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },

  {
    zoneId: "Z-HIN-008",
    areaName: "Hinjewadi Zone",
    coordinates: { lat: 18.5936, lng: 73.7301 },
    boundaries: { minLat: 18.5700, maxLat: 18.6100, minLng: 73.7000, maxLng: 73.7600 },
    status: "active",
    priority: "high",
    incidentCount: 0
  },
  {
    zoneId: "Z-WAK-009",
    areaName: "Wakad Zone",
    coordinates: { lat: 18.5911, lng: 73.7396 },
    boundaries: { minLat: 18.5700, maxLat: 18.6200, minLng: 73.7200, maxLng: 73.7600 },
    status: "active",
    priority: "high",
    incidentCount: 0
  },
  {
    zoneId: "Z-BAN-010",
    areaName: "Baner Zone",
    coordinates: { lat: 18.5597, lng: 73.7799 },
    boundaries: { minLat: 18.5400, maxLat: 18.5800, minLng: 73.7600, maxLng: 73.8000 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-BAL-011",
    areaName: "Balewadi Zone",
    coordinates: { lat: 18.5820, lng: 73.7690 },
    boundaries: { minLat: 18.5650, maxLat: 18.5950, minLng: 73.7500, maxLng: 73.7900 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-AUN-012",
    areaName: "Aundh Zone",
    coordinates: { lat: 18.5626, lng: 73.8087 },
    boundaries: { minLat: 18.5400, maxLat: 18.5800, minLng: 73.7950, maxLng: 73.8250 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },

  {
    zoneId: "Z-KHA-013",
    areaName: "Kharadi Zone",
    coordinates: { lat: 18.5510, lng: 73.9350 },
    boundaries: { minLat: 18.5300, maxLat: 18.5700, minLng: 73.9100, maxLng: 73.9600 },
    status: "active",
    priority: "high",
    incidentCount: 0
  },
  {
    zoneId: "Z-VIM-014",
    areaName: "Viman Nagar Zone",
    coordinates: { lat: 18.5666, lng: 73.9154 },
    boundaries: { minLat: 18.5500, maxLat: 18.5800, minLng: 73.8950, maxLng: 73.9300 },
    status: "active",
    priority: "high",
    incidentCount: 0
  },
  {
    zoneId: "Z-WAG-015",
    areaName: "Wagholi Zone",
    coordinates: { lat: 18.5806, lng: 73.9833 },
    boundaries: { minLat: 18.5600, maxLat: 18.6100, minLng: 73.9500, maxLng: 74.0200 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },

  {
    zoneId: "Z-HAD-016",
    areaName: "Hadapsar Zone",
    coordinates: { lat: 18.4995, lng: 73.9256 },
    boundaries: { minLat: 18.4700, maxLat: 18.5200, minLng: 73.9000, maxLng: 73.9600 },
    status: "active",
    priority: "high",
    incidentCount: 0
  },
  {
    zoneId: "Z-MUN-017",
    areaName: "Mundhwa Zone",
    coordinates: { lat: 18.5337, lng: 73.9318 },
    boundaries: { minLat: 18.5100, maxLat: 18.5550, minLng: 73.9100, maxLng: 73.9500 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },

  {
    zoneId: "Z-KAT-018",
    areaName: "Katraj Zone",
    coordinates: { lat: 18.4451, lng: 73.8690 },
    boundaries: { minLat: 18.4250, maxLat: 18.4700, minLng: 73.8450, maxLng: 73.8900 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-BIB-019",
    areaName: "Bibwewadi Zone",
    coordinates: { lat: 18.4800, lng: 73.8700 },
    boundaries: { minLat: 18.4600, maxLat: 18.4950, minLng: 73.8500, maxLng: 73.8900 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-KON-020",
    areaName: "Kondhwa Zone",
    coordinates: { lat: 18.4700, lng: 73.9000 },
    boundaries: { minLat: 18.4450, maxLat: 18.4950, minLng: 73.8750, maxLng: 73.9250 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },

  {
    zoneId: "Z-VIS-021",
    areaName: "Vishrantwadi Zone",
    coordinates: { lat: 18.5732, lng: 73.8813 },
    boundaries: { minLat: 18.5550, maxLat: 18.5950, minLng: 73.8600, maxLng: 73.9050 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },
  {
    zoneId: "Z-DHA-022",
    areaName: "Dhanori Zone",
    coordinates: { lat: 18.5939, lng: 73.8978 },
    boundaries: { minLat: 18.5700, maxLat: 18.6200, minLng: 73.8750, maxLng: 73.9250 },
    status: "active",
    priority: "medium",
    incidentCount: 0
  },

  {
    zoneId: "Z-GEN-999",
    areaName: "General Pune Zone",
    coordinates: { lat: 18.5200, lng: 73.8560 },
    boundaries: { minLat: 18.4000, maxLat: 18.7000, minLng: 73.7000, maxLng: 74.0500 },
    status: "active",
    priority: "low",
    incidentCount: 0
  }
];

const seedZones = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/civic_db";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB for advanced boundary-aware seeding...");

    await Zone.deleteMany({});

    const seededZones = [];

    for (const z of zonesMetadata) {
      // Count actual issues in this zone
      const incidentCount = await Issue.countDocuments({ zone: z.name });

      // Assign priority based on incident volume
      let priority = "low";
      if (incidentCount > 50) priority = "high";
      else if (incidentCount > 20) priority = "medium";

      const zoneData = {
        zoneId: `Z-${z.name.split(' ')[0].substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`,
        areaName: z.name,
        coordinates: { lat: z.center.lat, lng: z.center.lng },
        boundaries: z.bounds,
        status: "active",
        priority: priority,
        incidentCount: incidentCount
      };

      const newZone = await Zone.create(zoneData);
      seededZones.push(newZone);
    }

    console.log(`Successfully seeded ${seededZones.length} zones with boundaries.`);

    // Assign ALL zones to ALL departments by default
    const zoneListForDept = seededZones.map(z => ({
      zoneName: z.areaName,
      zoneCode: z.zoneId
    }));

    await Department.updateMany({}, {
      $set: { assignedZones: zoneListForDept }
    });

    console.log("Synchronized deep-sector grids with every department.");
    process.exit();
  } catch (error) {
    console.error("Advanced Seeding error:", error);
    process.exit(1);
  }
};

seedZones();
