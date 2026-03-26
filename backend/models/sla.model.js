import mongoose from "mongoose";

const levelSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true
  },

  value: {
    type: Number,
    required: true
  },

  unit: {
    type: String,
    enum: ["minutes", "hours", "days"],
    required: true
  }

}, { _id: false });

const slaSchema = new mongoose.Schema({
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    required: true,
    unique: true
  },

  levels: [levelSchema] // 🔥 multiple levels

}, { timestamps: true });

export default mongoose.model("SLA", slaSchema);