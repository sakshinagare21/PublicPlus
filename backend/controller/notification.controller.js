import Notification from "../models/notification.model.js";
import Admin from "../models/superadmin.model.js";
import Department from "../models/department.model.js";
import Operator from "../models/operator.model.js";
import User from "../models/user.model.js";

/* ================= GET ALL ADMIN NOTIFICATIONS ================= */
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetRole: "admin"
    })
      .populate("operatorId", "fullName email")
      .populate("departmentId", "departmentName")
      .populate({
        path: "issueId",
        select: "title category",
        populate: { path: "category", select: "name" }
      })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = notifications.map((n, index) => {
      try {
        return {
          srNo: index + 1,
          id: n._id,
          title: n.title || "Untitled System Alert",
          message: n.message || "No message content",
          type: n.type || "unknown",
          operator: (typeof n.operatorId === 'object' ? n.operatorId?.fullName : n.operatorId) || "N/A",
          department: (typeof n.departmentId === 'object' ? n.departmentId?.departmentName : n.departmentId) || "N/A",
          issue: (typeof n.issueId === 'object' ? n.issueId?.title : n.issueId) || "N/A",
          taskType: n.issueId?.category?.name || "Other",
          status: n.isRead ? "Read" : "Unread",
          date: n.createdAt ? new Date(n.createdAt).toLocaleString() : "Unknown Time"
        };
      } catch (err) {
        console.error("Mapping Warning for notification", n._id, err);
        return {
          srNo: index + 1,
          id: n._id,
          title: "Structural Mismatch Alert",
          message: "This alert uses an old data format and cannot be displayed fully.",
          type: "legacy",
          operator: "N/A",
          department: "N/A",
          issue: "N/A",
          status: "Read",
          date: "N/A"
        };
      }
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MARK SINGLE NOTIFICATION AS READ ================= */
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET UNREAD NOTIFICATIONS ================= */
export const getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetRole: "admin",
      isRead: false
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MARK ALL AS READ ================= */
export const markAllAsRead = async (req, res) => {
  try {

    let filter = { isRead: false };

    // 🔥 ADMIN
    if (req.admin) {
      filter.targetRole = "admin";
    }

    // 🔥 DEPARTMENT
    else if (req.department) {
      filter.targetRole = "department";
      filter.departmentId = req.department._id;
    }

    // 🔥 OPERATOR
    else if (req.operator) {
      filter.targetRole = "operator";
      filter.operatorId = req.operator._id;
    }

    // 🔥 USER
    else if (req.user) {
      filter.targetRole = "user";
      filter.userId = req.user._id;
    }

    await Notification.updateMany(filter, {
      $set: { isRead: true }
    });

    res.json({ message: "All notifications marked as read" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ================= DELETE NOTIFICATION ================= */
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getDepartmentNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      targetRole: "department",
      departmentId: req.department._id,

      // 🔥 FILTER OPERATOR RELATED + REOPENED
      type: {
        $in: ["operator_approved", "operator_rejected", "issue_created", "issue_resolved", "issue_reopened", "task_escalated"]
      }

    })
      .populate("operatorId", "fullName email")
      .populate({
        path: "issueId",
        select: "title resolution.escalation status"
      })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = notifications.map((n, index) => ({
      srNo: index + 1,
      id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      operator: n.operatorId?.fullName || "N/A",
      issue: n.issueId?.title || "N/A",
      issueId: n.issueId?._id || null,
      issueStatus: n.issueId?.status || null,
      escalation: n.escalation?.reason ? n.escalation : (n.issueId?.resolution?.escalation || null),
      status: n.isRead ? "Read" : "Unread",
      date: new Date(n.createdAt).toLocaleString()
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET OPERATOR NOTIFICATIONS ================= */
export const getOperatorNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetRole: "operator",
      operatorId: req.operator._id
    })
      .populate("issueId", "title description")
      .sort({ createdAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET USER NOTIFICATIONS ================= */
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetRole: "user",
      userId: req.user._id
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= MARK USER NOTIFICATION AS READ ================= */
export const markUserNotificationRead = async (req, res) => {
  try {
    const result = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }
    );
    if (!result) {
      return res.status(403).json({ message: "Unauthorized or notification not found" });
    }
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const firebaseUID = req.firebaseUser.uid;
    let filter = { isRead: false };

    // Identify user role and ID
    const [adminDoc, deptDoc, opDoc, userDoc] = await Promise.all([
      Admin.findOne({ firebaseUID }),
      Department.findOne({ firebaseUID }),
      Operator.findOne({ firebaseUID }),
      User.findOne({ firebaseUID })
    ]);

    if (adminDoc) {
      filter.targetRole = "admin";
    } else if (deptDoc) {
      filter.targetRole = "department";
      filter.departmentId = deptDoc._id;
    } else if (opDoc) {
      filter.targetRole = "operator";
      filter.operatorId = opDoc._id;
    } else if (userDoc) {
      filter.targetRole = "user";
      filter.userId = userDoc._id;
    } else {
      return res.status(404).json({ message: "User role not identified in publicplus database" });
    }

    const count = await Notification.countDocuments(filter);
    res.json({ count });
  } catch (error) {
    console.error("Unread count error:", error);
    res.status(500).json({ message: error.message });
  }
};

