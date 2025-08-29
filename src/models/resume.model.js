import mongoose from "mongoose";

const Resumeschema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        require: true,
    },
    resume_summary: {
        type: String,
    },
});

const Resume = mongoose.model("Resume", Resumeschema);

export default Resume;
