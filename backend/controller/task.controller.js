import Task from "../models/task.model.js";
import Issue from "../models/issue.model.js";
import Operator from "../models/operator.model.js";


/*create task controller*/
export const createTask = async (req, res) => {
  try {

    const { issueId, operatorId, title, description, slaDeadline } = req.body;

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const operator = await Operator.findById(operatorId);
    if (!operator || operator.departmentId.toString() !== req.department._id.toString()) {
      return res.status(400).json({ message: "Invalid operator" });
    }

    const task = await Task.create({
      issueId,
      departmentId: req.department._id,
      operatorId,
      title,
      description,
      slaDeadline
    });

    issue.status = "in_progress";
    await issue.save();

    operator.totalTasksAssigned += 1;
    operator.currentActiveTasks += 1;
    await operator.save();

    res.status(201).json({ message: "Task created successfully", task });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*get operator tasks controller*/
export const getDepartmentTasks = async (req, res) => {
  try {

    const tasks = await Task.find({
      departmentId: req.department._id
    }).populate("operatorId issueId");

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*get operator task details controller*/
export const getMyTasks = async (req, res) => {
  try {

    const tasks = await Task.find({
      operatorId: req.operator._id
    }).populate("issueId");

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*update task status and remark controller*/
export const updateTaskStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.operatorId.toString() !== req.operator._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    task.status = status;

    if (status === "completed") {
      task.completedAt = new Date();

      const issue = await Issue.findById(task.issueId);
      issue.status = "resolved";
      issue.resolvedAt = new Date();
      await issue.save();

      req.operator.totalTasksCompleted += 1;
      req.operator.currentActiveTasks -= 1;
      await req.operator.save();
    }

    await task.save();

    res.status(200).json({ message: "Task updated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/*remark task controller*/
export const addTaskRemark = async (req, res) => {
  try {

    const { message } = req.body;

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.operatorId.toString() !== req.operator._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    task.remarks.push({
      message,
      image: req.file ? req.file.path : null
    });

    await task.save();

    res.status(200).json({ message: "Remark added successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*delete task controller*/
export const deleteTask = async (req, res) => {
  try {

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.departmentId.toString() !== req.department._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};