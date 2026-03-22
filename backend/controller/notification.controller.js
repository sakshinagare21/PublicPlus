import Notification from "../models/notification.model.js";

/* ================= GET ALL ADMIN NOTIFICATIONS ================= */
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      targetRole: "admin"
    })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = notifications.map((n, index) => ({
      srNo: index + 1,
      id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      status: n.isRead ? "Read" : "Unread",
      date: new Date(n.createdAt).toLocaleString()
    }));

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

      // 🔥 FILTER ONLY OPERATOR RELATED
      type: {
        $in: ["operator_approved", "operator_rejected"]
      }

    })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = notifications.map((n, index) => ({
      srNo: index + 1,
      id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      status: n.isRead ? "Read" : "Unread",
      date: new Date(n.createdAt).toLocaleString()
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};