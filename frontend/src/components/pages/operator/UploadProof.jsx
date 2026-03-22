import { useParams } from "react-router-dom";
import { useState } from "react";
import OperatorLayout from "../../layout/OperatorLayout";
import { Upload, CheckCircle } from "lucide-react";

const UploadProof = () => {
  const { id } = useParams(); // task id

  const [remarks, setRemarks] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [proofs, setProofs] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Upload proof first");
      return;
    }

    const newProof = {
      id: Date.now(),
      taskId: id,
      image: preview,
      remarks,
      uploadedAt: new Date().toLocaleString(),
    };

    setProofs([newProof, ...proofs]);

    setRemarks("");
    setFile(null);
    setPreview(null);
  };

  return (
    <OperatorLayout>
      <div className="space-y-8">

        <h1 className="text-2xl font-bold">
          Upload Proof for Task {id}
        </h1>

        {/* Upload Section */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-6">

          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Describe work performed..."
            className="w-full bg-[#0f172a] border border-gray-700 rounded-lg p-3"
          />

          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
            />

            <label htmlFor="fileUpload" className="cursor-pointer">
              <Upload className="mx-auto text-gray-400" />
              <p className="text-gray-400 text-sm">
                Click to upload image
              </p>
            </label>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg"
            />
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Submit Proof
          </button>

        </div>

        {/* Proof History */}
        <div className="bg-[#111c2e] border border-gray-800 rounded-xl p-6 space-y-6">

          <h3 className="font-semibold">
            Uploaded Proof History
          </h3>

          {proofs.length === 0 && (
            <p className="text-gray-400 text-sm">
              No proofs uploaded yet.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {proofs.map((proof) => (
              <div
                key={proof.id}
                className="bg-[#0f172a] border border-gray-700 rounded-lg p-4 space-y-3"
              >
                <img
                  src={proof.image}
                  alt="Proof"
                  className="rounded-lg"
                />
                <p className="text-sm text-gray-300">
                  {proof.remarks}
                </p>
                <p className="text-xs text-gray-500">
                  {proof.uploadedAt}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </OperatorLayout>
  );
};

export default UploadProof;