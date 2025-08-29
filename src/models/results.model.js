import mongoose from "mongoose";
const domainSpecificResult = new mongoose.Schema({
    domainName: {
        type: String,
        required: true,
    },
    Number_of_question: {
        type: Number,
    },
    Number_of_answers_correct: {
        type: Number,
    },
    Number_of_answers_incorrect: {
        type: Number,
    },
    Number_of_skiped_questions: {
        type: Number,
    },
});

const InterviewResult = new mongoose.Schema(
    {
        session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
        user_id: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        technical_skill_score: {
            type: Number,
        },
        domain_specific_score: {
            type: [domainSpecificResult],
        },
        communication_skills_score: {
            type: Number,
        },
        questions_understanding_score: {
            type: Number,
        },
        problem_solving_score: {
            type: Number,
        },
        DepthOfKnowlege_score: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const Result = mongoose.model("Result", InterviewResult);

export default Result;
