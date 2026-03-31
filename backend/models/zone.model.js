import mongoose from "mongoose";

const zoneSchema = new mongoose.Schema(
 {
 zoneId: {
 type: String,
 required: true,
 unique: true,
 },
 areaName: {
 type: String,
 required: true,
 },
 coordinates: {
 lat: { type: Number, required: true },
 lng: { type: Number, required: true },
 },
 boundaries: {
 minLat: Number,
 maxLat: Number,
 minLng: Number,
 maxLng: Number,
 },
 status: {
 type: String,
 enum: ["active", "monitoring", "inactive"],
 default: "active",
 },
 priority: {
 type: String,
 enum: ["high", "medium", "low"],
 default: "low",
 },
 incidentCount: {
 type: Number,
 default: 0,
 },
 },
 {
 timestamps: true,
 }
);

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;

