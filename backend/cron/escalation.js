import cron from "node-cron";
import Issue from "../models/issue.model.js";
import SLA from "../models/sla.model.js";
import { sendEscalationEmail } from "../utils/email.js";

cron.schedule("*/5 * * * *", async () => {

  const now = new Date();

  const issues = await Issue.find({
    status: { $ne: "resolved" },
    "sla.resolutionDeadline": { $lt: now }
  }).populate("assignedDepartment assignedTo");

  for (let issue of issues) {

    const slaConfig = await SLA.findOne({
      priority: issue.priority.level
    });

    const currentLevel = issue.sla.escalationLevel;

    const nextLevel = slaConfig.levels.find(
      l => l.level === currentLevel + 1
    );

    /* 🔥 SEND EMAIL */
    await sendEscalationEmail(
      issue,
      issue.assignedDepartment,
      issue.assignedTo
    );

    /* 🔥 NEXT LEVEL LOGIC */

    if (nextLevel) {

      let newDeadline = new Date();

      if (nextLevel.unit === "minutes") {
        newDeadline.setMinutes(newDeadline.getMinutes() + nextLevel.value);
      } else if (nextLevel.unit === "hours") {
        newDeadline.setHours(newDeadline.getHours() + nextLevel.value);
      } else if (nextLevel.unit === "days") {
        newDeadline.setDate(newDeadline.getDate() + nextLevel.value);
      }

      issue.sla.resolutionDeadline = newDeadline;
      issue.sla.escalationLevel = nextLevel.level;

      issue.sla.escalationHistory.push({
        level: nextLevel.level,
        escalatedAt: new Date(),
        nextDeadline: newDeadline
      });

    } else {
      issue.sla.isBreached = true; // final stage
    }

    await issue.save();
  }

});