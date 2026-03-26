import Issue from "../models/issue.model.js";

import { detectZone } from "../services/zone.service.js";
import { getTrafficLevel } from "../services/traffic.service.js";
import { calculatePriority } from "../services/priority.service.js";
import { validateImage } from "../services/image.service.js";

import { assignIssue } from "../services/assignissue.service.js";
import SLA from "../models/sla.model.js";
/* ===== CITIZEN CREATE ISSUE ===== */

import IssueType from "../models/issueType.model.js";

export const createIssue = async (req, res) => {
  try {
    const { title, category, descriptionText, lat, lng } = req.body;

    if (!title || !category || lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "Title, category, lat and lng are required",
      });
    }

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({
        message: "Invalid latitude or longitude",
      });
    }

    /* ================= GET CATEGORY NAME ================= */
    const categoryDoc = await IssueType.findById(category);

    if (!categoryDoc) {
      return res.status(400).json({
        message: "Invalid category",
      });
    }

    /* ================= IMAGE ================= */
    let imageData = {};
    if (req.file) {
      imageData = await validateImage(req.file);
    }

    /* ================= ZONE ================= */
    const zone = detectZone(parsedLat, parsedLng);

    /* ================= TRAFFIC ================= */
    let traffic = { level: "unknown", ratio: 0 };

    try {
      traffic = await getTrafficLevel(parsedLat, parsedLng);
    } catch (err) {}

    /* ================= PRIORITY ================= */
    const priority = calculatePriority({
      category: categoryDoc.name, // 🔥 FIX
      description: descriptionText || "",
      traffic,
      upvotes: 0,
    });

    /* ================= SLA ================= */
    const slaConfig = await SLA.findOne({ priority: priority.level });

    let deadline = new Date();
    let level = 1;

    if (slaConfig && slaConfig.levels.length > 0) {
      const firstLevel = slaConfig.levels[0];

      if (firstLevel.unit === "minutes") {
        deadline.setMinutes(deadline.getMinutes() + firstLevel.value);
      } else if (firstLevel.unit === "hours") {
        deadline.setHours(deadline.getHours() + firstLevel.value);
      } else if (firstLevel.unit === "days") {
        deadline.setDate(deadline.getDate() + firstLevel.value);
      }

      level = firstLevel.level;
    } else {
      deadline.setHours(deadline.getHours() + 24);
    }

    /* ================= CREATE ISSUE ================= */
    const issue = await Issue.create({
      title,
      category, // ObjectId stored
      description: {
        text: descriptionText || "",
        source: "web_speech",
      },
      image: imageData,
      location: {
        type: "Point",
        coordinates: [parsedLng, parsedLat],
      },
      zone,
      traffic,
      priority,
      sla: {
        resolutionDeadline: deadline,
        escalationLevel: level,
        escalationHistory: [],
      },
      reportedBy: req.user._id,
    });

    /* ================= ASSIGN ================= */
    await assignIssue(issue);

    res.status(201).json({
      message: "Issue created successfully",
      issue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*=====citizen get all issues controller=====*/
export const getMyIssues = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const issues = await Issue.find({
      reportedBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Issue.countDocuments({
      reportedBy: req.user._id,
    });

    res.status(200).json({
      total,
      page: Number(page),
      issues,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*=====get issue by id controller=====*/
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId)
      .populate("reportedBy", "fullName email")
      .populate("assignedDepartment", "departmentName")
      .populate("assignedTo", "fullName email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*======Department view
all issues assigned to them controller=====*/
export const getDepartmentIssues = async (req, res) => {
  try {
    const { status, priority, zone, page = 1, limit = 10 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    /* ================= FILTER ================= */
    let filter = {
      assignedDepartment: req.department._id,
    };

    if (status) filter.status = status;
    if (priority) filter["priority.level"] = priority;
    if (zone) filter.zone = zone;

    /* ================= QUERY ================= */
    const issues = await Issue.find(filter)
      .sort({ "priority.score": -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("reportedBy", "fullName")
      .populate("assignedTo", "fullName");

    const total = await Issue.countDocuments(filter);

    /* ================= UNIQUE ZONES ================= */
    const zones = await Issue.distinct("zone", {
      assignedDepartment: req.department._id,
    });

    res.status(200).json({
      total,
      page: pageNum,
      issues,
      zones, // ✅ send zones for dropdown
    });
  } catch (error) {
    console.error("Department Issues Error:", error);
    res.status(500).json({ message: error.message });
  }
};
/*======get department statistics controller=====*/
export const getDepartmentStats = async (req, res) => {
  try {
    const departmentId = req.department._id;

    const total = await Issue.countDocuments({
      assignedDepartment: departmentId,
    });

    const pending = await Issue.countDocuments({
      assignedDepartment: departmentId,
      status: "reported",
    });

    const inProgress = await Issue.countDocuments({
      assignedDepartment: departmentId,
      status: "in_progress",
    });

    const resolved = await Issue.countDocuments({
      assignedDepartment: departmentId,
      status: "resolved",
    });

    res.json({
      total,
      pending,
      inProgress,
      resolved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*get operator issue*/
export const getOperatorIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      assignedTo: req.operator._id,
    })
      .populate("assignedDepartment", "departmentName")
      .sort({ createdAt: -1 });

    res.status(200).json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/*issue statistics for operator*/
export const getOperatorStats = async (req, res) => {
  try {
    const operatorId = req.operator._id;

    const total = await Issue.countDocuments({
      assignedTo: operatorId,
    });

    const pending = await Issue.countDocuments({
      assignedTo: operatorId,
      status: "reported",
    });

    const inProgress = await Issue.countDocuments({
      assignedTo: operatorId,
      status: "in_progress",
    });

    const completed = await Issue.countDocuments({
      assignedTo: operatorId,
      status: "resolved",
    });

    res.json({
      total,
      pending,
      inProgress,
      completed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*======get issue for admin*/
export const getAllIssuesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50, search = "" } = req.query;

    const filter = {};

    // 🔍 SEARCH (title + category)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { "description.text": { $regex: search, $options: "i" } }
      ];
    }

    const issues = await Issue.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("assignedDepartment", "departmentName")
      .populate("assignedTo", "fullName");

    const total = await Issue.countDocuments(filter);

    res.json({
      success: true,
      total,
      issues
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*show admin statistics*/
export const getAdminStats = async (req, res) => {
  try {

    const total = await Issue.countDocuments();

    const critical = await Issue.countDocuments({
      "priority.level": "critical"
    });

    const high = await Issue.countDocuments({
      "priority.level": "high"
    });

    const medium = await Issue.countDocuments({
      "priority.level": "medium"
    });

    const low = await Issue.countDocuments({
      "priority.level": "low"
    });

    const pending = await Issue.countDocuments({
      status: "reported"
    });

    const inProgress = await Issue.countDocuments({
      status: "in_progress"
    });

    const resolved = await Issue.countDocuments({
      status: "resolved"
    });

    res.json({
      success: true,
      stats: {
        total,
        critical,
        high,
        medium,
        low,
        pending,
        inProgress,
        resolved
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/*assign issue to department controller=====*/
export const assignDepartment = async (req, res) => {
  try {
    const { departmentId, priority, slaDeadline } = req.body;

    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.assignedDepartment = departmentId;
    issue.priority = priority || issue.priority;
    issue.slaDeadline = slaDeadline;
    issue.status = "assigned";

    await issue.save();

    res.status(200).json({ message: "Department assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*=====Department update issue status controller=====*/
export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (
      issue.assignedDepartment?.toString() !== req.department._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    issue.status = status;

    if (status === "resolved") {
      issue.resolvedAt = new Date();
    }

    await issue.save();

    res.status(200).json({ message: "Issue status updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*=====delete issue only if pending and owner controller=====*/
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (
      issue.reportedBy.toString() !== req.user._id.toString() ||
      issue.status !== "pending"
    ) {
      return res.status(403).json({ message: "Cannot delete this issue" });
    }

    await issue.deleteOne();

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
