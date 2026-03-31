import Zone from "../models/zone.model.js";

// @desc Create a new zone
// @route POST /api/zones
export const createZone = async (req, res) => {
 try {
 const { zoneId, areaName, lat, lng, status, priority, incidentCount } = req.body;

 const existingZone = await Zone.findOne({ zoneId });
 if (existingZone) {
 return res.status(400).json({ message: "Zone ID already exists" });
 }

 const zone = await Zone.create({
 zoneId,
 areaName,
 coordinates: { lat: Number(lat), lng: Number(lng) }, boundaries: req.body.boundaries,
 status: status || "active",
 priority: priority || "low",
 incidentCount: Number(incidentCount) || 0,
 });

 res.status(201).json({
 message: "Zone created successfully",
 zone,
 });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

// @desc Get all zones with optional filtering
// @route GET /api/zones
export const getAllZones = async (req, res) => {
 try {
 const { status, priority, search } = req.query;
 let query = {};

 if (status) query.status = status;
 if (priority) query.priority = priority;
 if (search) {
 query.$or = [
 { zoneId: { $regex: search, $options: "i" } },
 { areaName: { $regex: search, $options: "i" } },
 ];
 }

 const zones = await Zone.find(query).sort({ createdAt: -1 });
 res.json(zones);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

// @desc Get single zone
// @route GET /api/zones/:id
export const getSingleZone = async (req, res) => {
 try {
 const zone = await Zone.findById(req.params.id);
 if (!zone) {
 return res.status(404).json({ message: "Zone not found" });
 }
 res.json(zone);
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

// @desc Update zone
// @route PUT /api/zones/:id
export const updateZone = async (req, res) => {
 try {
 const { areaName, lat, lng, status, priority, incidentCount } = req.body;

 const zone = await Zone.findById(req.params.id);
 if (!zone) {
 return res.status(404).json({ message: "Zone not found" });
 }

 zone.areaName = areaName || zone.areaName;
 if (lat && lng) {
 zone.coordinates = { lat: Number(lat), lng: Number(lng) };
 }
 zone.status = status || zone.status;
 zone.priority = priority || zone.priority; if (req.body.boundaries) { zone.boundaries = req.body.boundaries; }
 if (incidentCount !== undefined) {
 zone.incidentCount = Number(incidentCount);
 }

 await zone.save();
 res.json({ message: "Zone updated successfully", zone });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

// @desc Delete zone
// @route DELETE /api/zones/:id
export const deleteZone = async (req, res) => {
 try {
 const zone = await Zone.findByIdAndDelete(req.params.id);
 if (!zone) {
 return res.status(404).json({ message: "Zone not found" });
 }
 res.json({ message: "Zone deleted successfully" });
 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

