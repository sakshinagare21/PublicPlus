import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({

  /* ================= FIREBASE AUTH ================= */

  firebaseUID: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  fullName: String,
  phoneNumber: String,

  role: {
    type: String,
    enum: ["citizen", "admin", "department"],
    default: "citizen"
  },

  accountStatus: {
    type: String,
    enum: ["active", "suspended", "blocked","deleted"],
    default: "active"
  },

  lastLogin: Date,


  /* ================= PROFILE ================= */

  profilePhoto: String,
  dateOfBirth: Date,
  gender: String,


  /* ================= LOCATION ================= */

  homeLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },

  preferredZones: [String],


  /* ================= TRUST SYSTEM ================= */

  trustMetrics: {
    trustScore: { type: Number, default: 50 },
    reportsSubmitted: { type: Number, default: 0 },
    validReports: { type: Number, default: 0 },
    rejectedReports: { type: Number, default: 0 }
  },


  /* ================= ENGAGEMENT ================= */

  engagementMetrics: {
    totalAppOpens: { type: Number, default: 0 },
    lastActiveDate: Date
  },


  /* ================= DEVICES ================= */

  devices: [
    {
      deviceId: String,
      platform: String,
      pushToken: String,
      lastUsed: Date
    }
  ],


  /* ================= NOTIFICATIONS ================= */

  notificationSettings: {
    pushEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true }
  },


  /* ================= AI PROFILE ================= */

  aiProfile: {
    reliabilityScore: { type: Number, default: 50 }
  },


  /* ================= RELATIONS ================= */

  reports: [{ type: Schema.Types.ObjectId, ref: "Report" }]

}, { timestamps: true });

export default mongoose.model("User", userSchema);