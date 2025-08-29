import mongoose from "mongoose";

const InerviewSessionSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
        interviewName: {
            type: String,
            required: true,
        },
        resume: {
            type: mongoose.Schema.ObjectId,
            ref: "Resume",
        },
        result: {
            type: mongoose.Schema.ObjectId,
            ref: "Result",
        },
        recordAudio: {
            type: Boolean,
        },
        recordVideo: {
            type: Boolean,
        },
        Status: {
            type: String,
            default: "Active",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Session = mongoose.model("Session", InerviewSessionSchema);
export default Session;
