import mongoose from "mongoose";
import dotenv from "dotenv";
import Notification from "../models/notification.model.js";
import Department from "../models/department.model.js";

dotenv.config({ path: "./.env" });

const sendTestNotification = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const department = await Department.findOne();
        if (!department) {
            console.log("No department found");
            process.exit(1);
        }

        console.log(`Targeting department: ${department.departmentName} (${department._id})`);

        const notification = await Notification.create({
            title: "Urgent: Unassigned Tasks (Test)",
            message: `SYSTEM TEST: 5 tasks are now unassigned and require immediate attention.`,
            type: "task_unassigned",
            targetRole: "department",
            departmentId: department._id,
        });

        console.log("Notification created successfully:", notification._id);
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

sendTestNotification();
