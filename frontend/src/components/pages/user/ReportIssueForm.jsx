import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DashboardLayout from "../../layout/DashboardLayout";
import {
  Camera,
  MapPin,
  Mic,
  MicOff,
  Target,
  ArrowLeft,
} from "lucide-react";

const steps = [
  { num: 1, label: "Media" },
  { num: 2, label: "Location" },
  { num: 3, label: "Details" },
];

const categories = [
  "pothole",
  "road_damage",
  "garbage",
  "drain",
  "water",
  "streetlight",
  "traffic_signal",
  "encroachment",
  "public_toilet",
  "fire",
];

const ReportIssue = () => {
  const [step, setStep] = useState(0);
  const [images, setImages] = useState([]);
  const [listening, setListening] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    category: "",
    descriptionText: "",
    lat: "",
    lng: "",
  });

  /* INPUT */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* IMAGE */
  const handleImage = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  /* REMOVE IMAGE */
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /* VOICE */
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return toast.error("Voice not supported");
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setForm((prev) => ({
        ...prev,
        descriptionText: prev.descriptionText + " " + text,
      }));
    };

    recognition.onend = () => setListening(false);
  };

  /* LOCATION */
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }));
        toast.success("Location detected");
      },
      () => toast.error("Location denied")
    );
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      await axios.post("http://localhost:5000/api/issues", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Issue submitted successfully 🚀");

      setShowPreview(false);
      setStep(0);
      setImages([]);
      setForm({
        title: "",
        category: "",
        descriptionText: "",
        lat: "",
        lng: "",
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-6">

        {/* STEP BAR */}
        <div className="flex justify-between mb-6">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 text-center">
              <div className={`h-1 ${i <= step ? "bg-blue-600" : "bg-gray-300"}`} />
              <p className="text-xs mt-2 text-gray-600">
                Step {s.num}: {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 0 && (
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Camera /> Upload Images
            </h2>

            <input
              type="file"
              multiple
              onChange={handleImage}
              className="border p-2 rounded w-full"
            />

            {/* IMAGE PREVIEW */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white px-1 text-xs rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <MapPin /> Location
            </h2>

            <div className="flex gap-3 mb-3">
              <input
                name="lat"
                value={form.lat}
                onChange={handleChange}
                placeholder="Latitude"
                className="w-full border p-2 rounded"
              />
              <input
                name="lng"
                value={form.lng}
                onChange={handleChange}
                placeholder="Longitude"
                className="w-full border p-2 rounded"
              />
            </div>

            <button
              onClick={getLocation}
              className="bg-gray-200 px-3 py-2 rounded flex gap-2"
            >
              <Target size={14} /> Detect Location
            </button>

            <div className="mt-4 flex justify-between">
              <button onClick={() => setStep(0)}>
                <ArrowLeft /> Back
              </button>

              <button
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Issue Details</h2>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border p-2 rounded mb-3"
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <div className="relative">
              <textarea
                name="descriptionText"
                value={form.descriptionText}
                onChange={handleChange}
                placeholder="Describe issue..."
                className="w-full border p-3 rounded h-28"
              />

              <button
                onClick={startVoice}
                className={`absolute right-3 bottom-3 p-2 rounded-full ${
                  listening ? "bg-red-500" : "bg-blue-600"
                } text-white`}
              >
                {listening ? <MicOff /> : <Mic />}
              </button>
            </div>

            <div className="mt-4 flex justify-between">
              <button onClick={() => setStep(1)}>
                <ArrowLeft /> Back
              </button>

              <button
                onClick={() => setShowPreview(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Preview
              </button>
            </div>
          </div>
        )}

        {/* ================= PREVIEW ================= */}
        {showPreview && (
          <div className="mt-6 border p-5 rounded-xl bg-gray-50">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>

            <p><b>Title:</b> {form.title}</p>
            <p><b>Category:</b> {form.category}</p>
            <p className="mt-2"><b>Description:</b> {form.descriptionText}</p>
            <p className="mt-2"><b>Location:</b> {form.lat}, {form.lng}</p>

            <div className="flex gap-3 mt-3 flex-wrap">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(img)}
                  className="w-20 h-20 rounded"
                />
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ReportIssue;