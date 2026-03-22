export const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.engagement.upvotes += 1;

    issue.priority.score += 2;

    await issue.save();

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/*=================update issue status controller=================*/
export const updateStatus = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = req.body.status;

    if (req.body.status === "resolved") {
      issue.sla.resolvedAt = new Date();
    }

    await issue.save();

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/*===================avoid duplicate upvote controller===================*/
export const voteIssue = async (req, res) => {
  try {
    const { vote } = req.body; // "upvote" or "downvote"
    const userId = req.user._id;

    if (!["upvote", "downvote"].includes(vote)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    /* ================= CHECK EXISTING VOTE ================= */

    const existingVote = issue.engagement.voters.find(
      (v) => v.user.toString() === userId.toString()
    );

    if (existingVote) {
      /* SAME VOTE → IGNORE */
      if (existingVote.vote === vote) {
        return res.json(issue);
      }

      /* CHANGE VOTE */
      if (existingVote.vote === "upvote") {
        issue.engagement.upvotes -= 1;
        issue.priority.score -= 2;
      } else {
        issue.engagement.downvotes -= 1;
      }

      existingVote.vote = vote;
    } else {
      /* NEW VOTE */
      issue.engagement.voters.push({
        user: userId,
        vote,
      });
    }

    /* ================= APPLY NEW VOTE ================= */

    if (vote === "upvote") {
      issue.engagement.upvotes += 1;
      issue.priority.score += 2;
    } else {
      issue.engagement.downvotes += 1;
      issue.priority.score -= 1; // optional penalty
    }

    /* ================= NORMALIZE ================= */

    if (issue.priority.score < 0) issue.priority.score = 0;
    if (issue.priority.score > 100) issue.priority.score = 100;

    await issue.save();

    res.json({
      message: "Vote updated",
      issue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*=================resoluted issue controller=================*/
import Operator from "../models/operator.model.js";

export const resolveIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = "resolved";

    issue.resolution = {
      resolvedBy: req.operator._id,
      notes: req.body.notes,
      afterImages: [req.file?.path],
    };

    await issue.save();

    /* ================= REDUCE LOAD ================= */
    const operator = await Operator.findById(issue.assignedTo);

    if (operator) {
      operator.currentActiveTasks -= 1;
      operator.totalTasksCompleted += 1;
      await operator.save();
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*=================heatmap data controller=================*/
export const getHeatmap = async (req, res) => {
  try {
    const issues = await Issue.find({}, "location priority");

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};