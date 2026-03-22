import { useState, useEffect } from "react";
import DepartmentLayout from "../../layout/DepartmentLayout";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { Clock, User } from "lucide-react";

const operators = [
  { id: "op1", name: "John Doe" },
  { id: "op2", name: "Sarah Miller" },
  { id: "op3", name: "David Kim" },
];

const initialData = {
  Pending: [
    {
      id: "1",
      title: "Water Main Leak - Sector 4",
      description:
        "Reported heavy flooding near community center intersection.",
      priority: "High",
      assignedTo: null,
      sla: 3600,
    },
  ],
  Assigned: [
    {
      id: "2",
      title: "Pothole Repair - Main St",
      description:
        "Severe pothole damaging vehicles near library entrance.",
      priority: "Medium",
      assignedTo: "John Doe",
      sla: 2400,
    },
  ],
  "In Progress": [
    {
      id: "3",
      title: "Street Light Outage",
      description:
        "Multiple lights out along river promenade walkway.",
      priority: "Urgent",
      assignedTo: "Sarah Miller",
      sla: 5200,
    },
  ],
  Done: [],
};

const TaskBoard = () => {
  const [columns, setColumns] = useState(initialData);

  // SLA Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setColumns((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((col) => {
          updated[col] = updated[col].map((task) => ({
            ...task,
            sla: task.sla > 0 ? task.sla - 1 : 0,
          }));
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];

    const [movedTask] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });
  };

  const assignOperator = (columnId, taskId, operatorName) => {
    setColumns((prev) => {
      const updated = { ...prev };
      updated[columnId] = updated[columnId].map((task) =>
        task.id === taskId
          ? { ...task, assignedTo: operatorName }
          : task
      );
      return updated;
    });
  };

  return (
    <DepartmentLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Task Board</h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {Object.entries(columns).map(([columnId, tasks]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-[#0f172a] p-4 rounded-xl min-h-[450px]"
                  >
                    <h3 className="text-gray-400 text-sm mb-4 uppercase">
                      {columnId} ({tasks.length})
                    </h3>

                    {tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-[#111c2e] border border-gray-800 p-4 rounded-lg mb-4 space-y-3"
                          >
                            {/* Priority */}
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === "High"
                                  ? "bg-red-600/20 text-red-400"
                                  : task.priority === "Urgent"
                                  ? "bg-orange-600/20 text-orange-400"
                                  : "bg-yellow-600/20 text-yellow-400"
                              }`}
                            >
                              {task.priority}
                            </span>

                            {/* Title */}
                            <h4 className="font-medium">
                              {task.title}
                            </h4>

                            {/* Description */}
                            <p className="text-gray-400 text-sm">
                              {task.description}
                            </p>

                            {/* Assigned To */}
                            <div className="flex items-center gap-2 text-sm">
                              <User size={14} className="text-gray-400" />
                              {task.assignedTo ? (
                                <span className="text-blue-400">
                                  {task.assignedTo}
                                </span>
                              ) : (
                                <span className="text-gray-500">
                                  Not Assigned
                                </span>
                              )}
                            </div>

                            {/* Assign Dropdown */}
                            <select
                              onChange={(e) =>
                                assignOperator(
                                  columnId,
                                  task.id,
                                  e.target.value
                                )
                              }
                              className="w-full bg-[#0f172a] border border-gray-700 rounded-lg px-2 py-1 text-sm"
                            >
                              <option value="">
                                Assign Operator
                              </option>
                              {operators.map((op) => (
                                <option
                                  key={op.id}
                                  value={op.name}
                                >
                                  {op.name}
                                </option>
                              ))}
                            </select>

                            {/* SLA */}
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                              <Clock size={14} />
                              {formatTime(task.sla)}
                            </div>

                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}

          </div>
        </DragDropContext>
      </div>
    </DepartmentLayout>
  );
};

export default TaskBoard;