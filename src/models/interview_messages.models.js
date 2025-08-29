import mongoose from "mongoose";

const message_turn_schema = new mongoose.Schema(
    {
        session_id: {
            type: mongoose.Schema.ObjectId,
            ref: "Session",
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        difficulty: {
            type: String,
            required: true,
        },
        Question: {
            type: String,
            required: true,
        },
        Answer: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const message_turn = mongoose.model("message_turn", message_turn_schema);

export default message_turn;
