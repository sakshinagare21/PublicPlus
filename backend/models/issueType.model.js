import mongoose from "mongoose";

const issueTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("IssueType", issueTypeSchema);
