import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    /* ================= RELATION ================= */

    issueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      index: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
      required: true,
      index: true,
    },

    /* ================= BASIC INFO ================= */

    title: {
      type: String,
      required: true,
    },

    description: String,

    /* ================= STATUS ================= */

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },

    /* ================= REMARKS + PROOF ================= */

    remarks: [
      {
        message: {
          type: String,
          required: true,
        },

        image: {
          type: String, // stores file path or cloud URL
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    /* ================= SLA ================= */

    slaDeadline: Date,

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;