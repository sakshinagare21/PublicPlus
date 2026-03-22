import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import {
  Clock,
  AlertTriangle,
  Upload,
  CheckCircle,
} from "lucide-react";

const TaskDetails = () => {
  const { id } = useParams();

  // ===== Mock Task Data =====
  const task = {
    id,
    title: "Street Light Repair - Main St. NW",
    description:
      "Main street light #42 has been reported flickering and failing after dark. Inspect wiring harness and replace LED module if necessary.",
    priority: "High",
    status: "In Progress",
  };

  // ===== SLA Countdown (1 hour demo) =====
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // ===== Upload State =====
  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewURL = URL.createObjectURL(selectedFile);
      setPreview(previewURL);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Please upload proof before submitting.");
      return;
    }

    // Simulate upload
    console.log("Submitting Task:", {
      remarks,
      file,
    });

    alert("Task Submitted Successfully!");
  };

  return (
    <OperatorLayout>
      <div className="space-y-8">

        {/* ===== SLA WARNING BAR ===== */}
        <div className="bg-red-900/30 border border-red-700 p-4 rounded-lg flex justify-between items-center">
          <div className="flex items-center gap-2 text-red-400 font-medium">
            <AlertTriangle size={18} />
            SLA DEADLINE APPROACHING
          </div>
          <div className="text-red-400 font-mono text-lg">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* ===== TITLE ===== */}
        <div>
          <h1 className="text-2xl font-bold">
            {task.title}
          </h1>
          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span className="text-red-400 flex items-center gap-1">
              <AlertTriangle size={14} />
              {task.priority} Priority
            </span>
            <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full">
              {task.status}
            </span>
          </div>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: DETAILS */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Issue Details</h3>
            <p className="text-gray-300">
              {task.description}
            </p>

            <img
              src="https://images.unsplash.com/photo-1509395176047-4a66953fd231"
              alt="Issue"
              className="rounded-lg mt-4"
            />
          </div>

          {/* RIGHT: OPERATION PANEL */}
          <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-6">

            <h3 className="font-semibold text-blue-400">
              Operation Panel
            </h3>

            {/* Remarks */}
            <div>
              <label className="text-sm text-gray-400">
                Completion Remarks
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Describe work performed..."
                className="w-full mt-2 bg-[#0f172a] border border-gray-700 rounded-lg p-3 outline-none"
                rows="4"
              />
            </div>

            {/* Upload */}
            <div>
              <label className="text-sm text-gray-400">
                Upload Completion Evidence
              </label>

              <div className="mt-2 border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileUpload"
                />

                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="text-gray-400" />
                  <span className="text-gray-400 text-sm">
                    Click to upload image
                  </span>
                </label>

              </div>

              {/* Preview */}
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 rounded-lg"
                />
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <CheckCircle size={18} />
              SUBMIT & RESOLVE TASK
            </button>

          </div>

        </div>

      </div>
    </OperatorLayout>
  );
};

export default TaskDetails;