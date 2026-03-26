import SLA from "../models/sla.model.js";

/* ================= SET / UPDATE SLA ================= */
export const setSLA = async (req, res) => {
  try {
    const { priority, levels } = req.body;

    if (!priority || !levels || !Array.isArray(levels)) {
      return res.status(400).json({
        message: "Priority and levels are required"
      });
    }

    for (let lvl of levels) {
      if (!lvl.level || !lvl.value || !lvl.unit) {
        return res.status(400).json({
          message: "Each level must have level, value, unit"
        });
      }
    }

    const sla = await SLA.findOneAndUpdate(
      { priority },
      { levels },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: "SLA updated successfully",
      sla
    });

  } catch (err) {
    console.log("SLA ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= GET SLA ================= */
export const getSLA = async (req, res) => {
  try {
    const { priority } = req.query;

    let sla;

    if (priority) {
      sla = await SLA.findOne({ priority });
    } else {
      sla = await SLA.find();
    }

    res.status(200).json({
      success: true,
      sla
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};