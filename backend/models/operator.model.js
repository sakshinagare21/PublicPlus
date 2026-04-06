import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema(
    {
        /* ================= FIREBASE LINK ================= */

        firebaseUID: {
            type: String,
            required: true,
            unique: true,
        },

        email: {
            type: String,
            required: true,
        },

        /* ================= BASIC INFO ================= */

        fullName: {
            type: String,
            required: true,
        },

        phoneNumber: String,

        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },

        /* ================= ZONE ================= */

        assignedZone: {
            zoneName: String, // "Shivajinagar Zone"
            zoneCode: String, // "ZONE_A"
        },

        /* ================= STATUS ================= */

        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "inactive",
        },

        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        approvalInfo: {
            approvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Department",
            },
            approvedAt: Date,
        },

        /* ================= WORKLOAD (IMPORTANT) ================= */

        currentActiveTasks: {
            type: Number,
            default: 0,
        },

        maxCapacity: {
            type: Number,
            default: 10, // max tasks operator can handle
        },

        /* ================= PERFORMANCE ================= */

        totalTasksAssigned: {
            type: Number,
            default: 0,
        },

        totalTasksCompleted: {
            type: Number,
            default: 0,
        },

        /* ================= RATING & TRUST ================= */

        ratingAverage: {
            type: Number,
            default: 0,
        },

        totalRatings: {
            type: Number,
            default: 0,
        },

        trustScore: {
            type: Number,
            default: 50,
        },

        /* ================= OPTIONAL (ADVANCED) ================= */

        lastAssignedAt: Date, // for fair distribution
    },
    { timestamps: true }
);

const Operator = mongoose.model("Operator", operatorSchema);

export default Operator;
