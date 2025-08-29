import { Router } from "express";
import {
    history_list,
    getResult,
    getReferenceLinks,
    isResumePresent,
    total_interviews,
} from "../controllers/interview.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

chatRouter.route("/history").get(verifyUser, history_list);
chatRouter.route("/interview-result/:session_id").get(getResult);
chatRouter
    .route("/interview-result/reference_links/:session_id")
    .get(getReferenceLinks);
chatRouter.route("/isResume").get(verifyUser, isResumePresent); // this will give the resume data if not user will have to upload that will be handled by the python fast api
chatRouter
    .route("/totalInterview")
    .get(verifyUser, total_interviews); // gives total number of interviews

export default chatRouter;
