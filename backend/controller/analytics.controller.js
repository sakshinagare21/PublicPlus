import Issue from "../models/issue.model.js";
import Zone from "../models/zone.model.js";
import mongoose from "mongoose";

export const getAdminAnalytics = async (req, res) => {
 try {
 const { startDate, endDate, zone, priority, status } = req.query;

 // Build filter object
 const filter = {};
 if (startDate && startDate !== "") {
 const start = new Date(startDate);
 if (!isNaN(start.getTime())) {
 filter.createdAt = { ...filter.createdAt, $gte: start };
 }
 }
 if (endDate && endDate !== "") {
 const end = new Date(endDate);
 if (!isNaN(end.getTime())) {
 end.setHours(23, 59, 59, 999);
 filter.createdAt = { ...filter.createdAt, $lte: end };
 }
 }
 
 if (zone) filter.zone = zone;
 if (priority) filter["priority.level"] = priority;
 if (status) filter.status = status;

 // 1. KPI Metrics
 const totalZones = await Zone.countDocuments();
 const totalIncidents = await Issue.countDocuments(filter);
 const resolvedIncidents = await Issue.countDocuments({ ...filter, status: "resolved" });
 const pendingIncidents = await Issue.countDocuments({ ...filter, status: { $ne: "resolved" } });

 // 2. Zone-wise Analysis (Aggregation)
 const zoneAnalysis = await Issue.aggregate([
 { $match: filter },
 { $group: { _id: "$zone", count: { $sum: 1 } } },
 { $sort: { count: -1 } }
 ]);

 // 3. Status Distribution
 const statusAnalysis = await Issue.aggregate([
 { $match: filter },
 { $group: { _id: "$status", value: { $sum: 1 } } }
 ]);

 // 4. Priority Distribution
 const priorityAnalysis = await Issue.aggregate([
 { $match: filter },
 { $group: { _id: "$priority.level", value: { $sum: 1 } } }
 ]);

 // 5. Incident Trends (By Day)
 const trendAnalysis = await Issue.aggregate([
 { $match: filter },
 {
 $group: {
 _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
 count: { $sum: 1 }
 }
 },
 { $sort: { _id: 1 } }
 ]);

 // 6. Worst & Best Zones
 const worstZone = zoneAnalysis.length > 0 ? zoneAnalysis[0] : null;
 const bestZone = zoneAnalysis.length > 0 ? zoneAnalysis[zoneAnalysis.length - 1] : null;

 // 7. Heatmap Data (lat/lng of incidents)
 const heatmapData = await Issue.find(filter).select("location priority status");

 res.status(200).json({
 summary: {
 totalZones,
 totalIncidents,
 resolvedIncidents,
 pendingIncidents,
 },
 charts: {
 zoneAnalysis: zoneAnalysis.map(z => ({ name: z._id || "Unknown", incidents: z.count })),
 statusAnalysis: statusAnalysis.map(s => ({ name: s._id, value: s.value })),
 priorityAnalysis: priorityAnalysis.map(p => ({ name: p._id, value: p.value })),
 trendAnalysis: trendAnalysis.map(t => ({ date: t._id, count: t.count }))
 },
 rankings: {
 worstZone,
 bestZone
 },
 heatmapData: heatmapData
 .filter(h => h.location?.coordinates?.length === 2)
 .map(h => [h.location.coordinates[1], h.location.coordinates[0], 1]) // [lat, lng, intensity]
 });

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

export const getUserAnalytics = async (req, res) => {
 try {
 const userId = req.user._id;

 const resolvedFilter = { reportedBy: userId, status: "resolved" };

 // 1. KPI Metrics
 const totalResolved = await Issue.countDocuments(resolvedFilter);
 
 // 2. Average Resolution Time
 const resolvedIssues = await Issue.find(resolvedFilter)
 .populate("assignedDepartment", "departmentName")
 .sort({ resolvedAt: -1 })
 .lean();

 let totalDurationMs = 0;
 let impactScore = 0;

 resolvedIssues.forEach(issue => {
 if (issue.resolvedAt && issue.createdAt) {
 totalDurationMs += new Date(issue.resolvedAt) - new Date(issue.createdAt);
 }
 impactScore += (issue.engagement?.upvotes || 0) * 10 + 50; // Simple formula: 50 base per resolved + upvotes
 });

 const avgResolutionTimeDays = totalResolved > 0 
 ? (totalDurationMs / (1000 * 60 * 60 * 24) / totalResolved).toFixed(1) 
 : 0;

 res.status(200).json({
 stats: {
 totalResolved,
 avgResolutionTime: `${avgResolutionTimeDays} Days`,
 impactScore: `${Math.min(impactScore, 1000)}/1000`
 },
 resolvedItems: resolvedIssues.map(i => ({
 id: i._id,
 title: i.title,
 department: i.assignedDepartment?.departmentName || "General",
 location: i.zone || "City Limits",
 reported: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
 fixed: new Date(i.resolvedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
 verified: new Date(i.resolvedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
 duration: i.resolvedAt ? `${Math.ceil((new Date(i.resolvedAt) - new Date(i.createdAt)) / (1000 * 60 * 60))} Hours` : "N/A",
 upvotes: i.engagement?.upvotes || 0
 }))
 });

 } catch (error) {
 res.status(500).json({ message: error.message });
 }
};

