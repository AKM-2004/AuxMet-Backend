// this is the file from program will start
import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import { connectDB } from "./db/index.js";
import message_turn from "./models/interview_messages.models.js";
import Session from "./models/interview_session.model.js";
import Result from "./models/results.model.js";
import RefrenceLinks from "./models/refrenceLinks.model.js";
import Resume from "./models/resume.model.js";
dotenv.config({ path: "../.env" });
// if db will be connected only then we will run the app

// async function seedDatabase() { // for testing purpose
//     try {
//         // Insert dummy message_turn
//         await message_turn.create({
//             session_id: new mongoose.Types.ObjectId(),
//             subject: "init",
//             difficuilty: "easy",
//             Question: "What is MongoDB?",
//             Answer: "NoSQL database",
//         });

//         // Insert dummy Session
//         await Session.create({
//             user_id: new mongoose.Types.ObjectId(),
//             interviewName: "Mock Interview - Web Dev", // <-- required field
//             resume: new mongoose.Types.ObjectId(),
//             result: new mongoose.Types.ObjectId(),
//             recordAudio: true,
//             recordVideo: false,
//         });

//         // Insert dummy Result
//         await Result.create({
//             session_id: new mongoose.Types.ObjectId(),
//             user_id: new mongoose.Types.ObjectId(),
//             technical_skill_score: "8.5",
//             domain_specific_score: [
//                 {
//                     domainName: "Web Development",
//                     Number_of_question: "10",
//                     Number_of_answers_correct: "8",
//                     Number_of_skiped_questions: "1",
//                 },
//                 {
//                     domainName: "Machine Learning",
//                     Number_of_question: "7",
//                     Number_of_answers_correct: "5",
//                     Number_of_skiped_questions: "1",
//                 },
//             ],
//             communication_skills_score: "7.8",
//             questions_understanding_score: "8.2",
//             problem_solving_score: "7.5",
//             DepthOfKnowlege_score: "9.0",
//         });

//         // Insert dummy Reference Links
//         await RefrenceLinks.create({
//             session_id: new mongoose.Types.ObjectId(),
//             user_id: new mongoose.Types.ObjectId(),
//             refrenceLinks: {
//                 Q1: "https://learn.com/explain1",
//                 Q2: "https://learn.com/explain2",
//                 Q3: "Skipped",
//             },
//         });

//         // Insert dummy Resume
//         await Resume.create({
//             user_id: new mongoose.Types.ObjectId(),
//         });

//         console.log("Seed data inserted successfully!");
//     } catch (err) {
//         console.error("Error seeding data:", err);
//     }
// }

// for testing purpose

connectDB()
    .then(async () => {
        // putting the sample data so that i can access this from modeles from the python.
        // await seedDatabase();
        app.listen(7575, () => {
            console.log("APP IS CONNECTED on PORT 7575");
        });
    })
    .catch((err) => {
        console.log("There is ERROR", err);
    });
