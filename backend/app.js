// app.js

import express from "express";
import cors from "cors";
import morgan from "morgan";

// =============================
// ROUTE IMPORTS
// =============================

import userRoutes from "./routes/user.route.js";
import issueRoutes from "./routes/issue.route.js";
import departmentRoutes from "./routes/department.route.js";
import adminRoutes from "./routes/admin.route.js";
import operatorRoutes from "./routes/operator.route.js";
import notificationRoutes from "./routes/notification.routes.js";
import SLARoute from "./routes/sla.route.js"
import issueTypeRoutes from "./routes/issueType.routes.js";
import zoneRoutes from "./routes/zone.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import contactRoutes from "./routes/contact.route.js";

import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// =============================
// MIDDLEWARE
// =============================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging (development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// =============================
// ROUTES
// =============================

app.get("/", (req, res) => {
  res.send("PublicPlus API Running...");
});

// USER
app.use("/api/users", userRoutes);

// ISSUE
app.use("/api/issues", issueRoutes);

// DEPARTMENT
app.use("/api/departments", departmentRoutes);

// ADMIN
app.use("/api/admin", adminRoutes);

// OPERATOR
app.use("/api/operator", operatorRoutes);

app.use("/api/notification", notificationRoutes);

app.use("/api/sla", SLARoute);

app.use("/api/issue-types", issueTypeRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/contact", contactRoutes);
// =============================
// ERROR HANDLING
// =============================

app.use(notFound);
app.use(errorHandler);

export default app;