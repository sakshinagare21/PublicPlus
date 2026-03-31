import mongoose from "mongoose";
import dotenv from "dotenv";
import Zone from "./models/zone.model.js";
import Issue from "./models/issue.model.js";
import Department from "./models/department.model.js";

dotenv.config();

const zonesMetadata = [
  { 
    name: "Shivajinagar Zone", center: { lat: 18.535, lng: 73.855 },
    bounds: { minLat: 18.52, maxLat: 18.55, minLng: 73.84, maxLng: 73.87 }
  },
  { 
    name: "Kothrud Zone", center: { lat: 18.505, lng: 73.820 },
    bounds: { minLat: 18.49, maxLat: 18.52, minLng: 73.80, maxLng: 73.84 }
  },
  { 
    name: "Hadapsar Zone", center: { lat: 18.485, lng: 73.945 },
    bounds: { minLat: 18.47, maxLat: 18.50, minLng: 73.92, maxLng: 73.97 }
  },
  { 
    name: "Baner Zone", center: { lat: 18.565, lng: 73.785 },
    bounds: { minLat: 18.55, maxLat: 18.58, minLng: 73.77, maxLng: 73.80 }
  },
  { 
    name: "Wakad Zone", center: { lat: 18.600, lng: 73.770 },
    bounds: { minLat: 18.58, maxLat: 18.62, minLng: 73.75, maxLng: 73.79 }
  },
  { 
    name: "Viman Nagar Zone", center: { lat: 18.570, lng: 73.915 },
    bounds: { minLat: 18.56, maxLat: 18.58, minLng: 73.90, maxLng: 73.93 }
  },
  { 
    name: "Sinhagad Road Zone", center: { lat: 18.500, lng: 73.840 },
    bounds: { minLat: 18.48, maxLat: 18.52, minLng: 73.82, maxLng: 73.86 }
  },
  { 
    name: "Camp Zone", center: { lat: 18.510, lng: 73.880 },
    bounds: { minLat: 18.50, maxLat: 18.52, minLng: 73.87, maxLng: 73.89 }
  },
  { 
    name: "General Pune Zone", center: { lat: 18.520, lng: 73.856 },
    bounds: { minLat: 18.40, maxLat: 18.70, minLng: 73.70, maxLng: 74.00 }
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
        zoneId: `Z-${z.name.split(' ')[0].substring(0, 3).toUpperCase()}-${Math.floor(Math.random()*900)+100}`,
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
