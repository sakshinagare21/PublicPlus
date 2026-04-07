import { useState, useEffect } from "react";
import axios from "axios";
import DepartmentLayout from "../../layout/DepartmentLayout";
import toast from "react-hot-toast";

const IssueTypeForm = () => {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [takenTypes, setTakenTypes] = useState([]);
    const [issueTypes, setIssueTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    /* ================= FETCH ISSUE TYPES (FROM ADMIN) ================= */
    const fetchIssueTypes = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/issue-types`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setIssueTypes(res.data.types);

        } catch (err) {
            console.log("Error fetching issue types");
        }
    };

    /* ================= FETCH TAKEN TYPES ================= */
    const fetchTaken = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/departments/taken-types`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // only store IDs
            setTakenTypes(res.data.taken.map((t) => t._id));

        } catch (err) {
            console.log("Error fetching taken types");
        }
    };

    /* ================= FETCH CURRENT DEPARTMENT ================= */
    const fetchMyDepartment = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/departments/me`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const ids =
                res.data.issueTypes?.map((t) => t._id) || [];

            setSelectedTypes(ids);

        } catch (err) {
            console.log("Error fetching department data");
        }
    };

    /* ================= INITIAL LOAD ================= */
    useEffect(() => {
        fetchIssueTypes(); // 🔥 from admin DB
        fetchTaken();
        fetchMyDepartment();
    }, []);

    /* ================= HANDLE CHANGE ================= */
    const handleChange = (id) => {
        setSelectedTypes((prev) =>
            prev.includes(id)
                ? prev.filter((t) => t !== id)
                : [...prev, id]
        );
    };

    /* ================= RESET ================= */
    const handleReset = () => {
        setSelectedTypes([]);
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/departments/issue-types`,
                { issueTypes: selectedTypes },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedIds = res.data.department.issueTypes.map(
                (id) => id.toString()
            );

            setSelectedTypes(updatedIds);

            await fetchTaken();

            toast.success("Operational scope updated successfully");

        } catch (err) {
            toast.error(err.response?.data?.message || "Transmission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DepartmentLayout>
            <div className="max-w-4xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-foreground">
                        Department Issue Scope
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Select the issue types your department will handle
                    </p>
                </div>

                {/* MAIN CARD */}
                <div className="bg-card border rounded-xl p-8 shadow-sm">

                    {/* SUBTITLE */}
                    <h3 className="text-sm font-medium text-muted-foreground mb-6">
                        Available Issue Types
                    </h3>

                    {/* GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {issueTypes.map((type) => {
                            const isTaken = takenTypes.includes(type._id);
                            const isSelected = selectedTypes.includes(type._id);

                            return (
                                <div
                                    key={type._id}
                                    onClick={() => !isTaken && handleChange(type._id)}
                                    className={`
 p-4 rounded-lg border transition-all cursor-pointer
 ${isTaken
                                            ? "bg-muted opacity-50 cursor-not-allowed"
                                            : "hover:border-primary hover:shadow-sm"}
 ${isSelected ? "border-primary bg-primary/5" : ""}
 `}
                                >
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-sm font-medium text-foreground">
                                            {type.label}
                                        </h4>

                                        {!isTaken && (
                                            <div
                                                className={`w-4 h-4 rounded border flex items-center justify-center
 ${isSelected ? "bg-primary border-primary" : "border-gray-400"}`}
                                            >
                                                {isSelected && (
                                                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {isTaken && (
                                        <p className="text-xs text-red-500 mt-2">
                                            Already assigned
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-md hover:bg-muted hover:text-foreground transition"
                        >
                            Reset
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || selectedTypes.length === 0}
                            className={`
 px-6 py-2 rounded-md text-sm font-medium transition
 ${loading
                                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                                    : "bg-primary text-white hover:bg-primary/90"}
 `}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>

                {/* FOOTER NOTE */}
                <div className="p-4 bg-muted rounded-lg border text-sm text-muted-foreground">
                    Note: Issue types already assigned to other departments cannot be selected.
                </div>

            </div>
        </DepartmentLayout>
    );
};

export default IssueTypeForm;


