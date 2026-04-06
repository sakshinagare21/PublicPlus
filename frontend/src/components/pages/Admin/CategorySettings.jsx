import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function CategorySettings() {

    const [types, setTypes] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    /* ================= FETCH ================= */
    const fetchTypes = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/issue-types", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (data.success) {
                setTypes(data.types);
            }

        } catch (err) {
            toast.error("Failed to load issue types");
        }
    };

    useEffect(() => {
        fetchTypes();
    }, []);

    /* ================= ADD ================= */
    const addType = async () => {
        if (!name.trim()) {
            return toast.error("Enter issue type");
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:5000/api/issue-types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Issue type added");
                setName("");
                fetchTypes();
            } else {
                toast.error(data.message);
            }

        } catch (err) {
            toast.error("Error adding issue type");
        } finally {
            setLoading(false);
        }
    };

    /* ================= DELETE ================= */
    const deleteType = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/issue-types/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Deleted");
            fetchTypes();

        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="space-y-6 transition-colors">
            {/* HEADER */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Issue Types</h2>
                <p className="text-muted-foreground text-sm">
                    Manage all available issue categories within the system
                </p>
            </div>

            {/* ADD CARD */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-colors">
                <h3 className="mb-4 font-semibold text-foreground/80">Add Issue Type</h3>

                <div className="flex gap-3">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter issue type (e.g. Street Light)"
                        className="flex-1 bg-muted/30 border border-border px-4 py-2.5 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/40"
                    />

                    <button
                        onClick={addType}
                        disabled={loading}
                        className="bg-primary text-white hover:opacity-90 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-glow shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add"}
                    </button>
                </div>
            </div>

            {/* LIST CARD */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12"></div>
                <h3 className="mb-6 font-semibold text-foreground/80">Issue Types List</h3>

                {types.length === 0 ? (
                    <p className="text-muted-foreground   text-sm py-4">No issue types found in the grid...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {types.map((t) => (
                            <div
                                key={t._id}
                                className="flex justify-between items-center bg-muted/20 border border-border/50 px-4 py-3 rounded-xl transition-all hover:bg-muted/30 group"
                            >
                                <span className="capitalize text-sm font-medium text-foreground/90">{t.label}</span>

                                <button
                                    onClick={() => deleteType(t._id)}
                                    className="text-destructive/60 hover:text-destructive text-xs font-bold transition-colors px-2 py-1 rounded-lg hover:bg-destructive/10"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

