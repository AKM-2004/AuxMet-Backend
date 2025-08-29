import mongoose from "mongoose";

const refrenceLinksSchema = new mongoose.Schema(
    {
        session_id: {
            type: mongoose.Schema.ObjectId,
            ref: "Session",
        },
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        refrenceLinks: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        },
    },
    { timestamps: true }
);
const RefrenceLinks = mongoose.model("RefrenceLinks", refrenceLinksSchema);
export default RefrenceLinks;
