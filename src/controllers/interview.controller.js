import ApiResponse from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import Session from "../models/interview_session.model.js";
import Result from "../models/results.model.js";
import Resume from "../models/resume.model.js";
import RefrenceLinks from "../models/refrenceLinks.model.js";
const history_list = asyncHandler(async (req, res) => {
    const user_id = req.user?._id; // req.user came from the middle ware
    if (!user_id) {
        throw new ApiError(401, "user not found");
    }
    const sessions_array = await Session.find({ user_id: user_id }).sort({
        createdAt: -1,
    });
    res.status(201).json(
        new ApiResponse(201, sessions_array, "successfully all the sessions !")
    );
});

// const skills_result = asyncHandler(async (req, res) => {
//     // session id will come from the front end as you click
//     const session_id =
//         req.session_id || req.header("session_id")?.replace("Bearer", "");
//     if (!session_id) {
//         throw new ApiError(401, "this session is not found");
//     }

//     const result = await Result.find({ session_id: session_id });

//     if (!result) {
//         throw new ApiError(401, "result not found");
//     }

//     res.status(201).json(
//         new ApiResponse(201, result, "successfully given the output !")
//     );
// });

const isResumePresent = asyncHandler(async (req, res) => {
    const user_id = req.user?._id; // middle ware se user will come

    if (!user_id) {
        throw new ApiError(401, "can't fetch the user");
    }

    const resume = await Resume.findOne({ user_id: user_id });
    const isresume = true;

    if (!resume) {
        isresume = false;
    }

    res.status(201).json(new ApiResponse(201, isresume, "response done"));
});

const total_interviews = asyncHandler(async (req, res) => {
    const user_id = req.user?._id;

    if (!user_id) {
        throw new ApiError(404, "not found");
    }

    const interviews = await Session.find({ user_id: user_id });
    const noOfinterview = interviews.length;

    res.status(201).json(
        new ApiResponse(201, noOfinterview, "no of interviews")
    );
});

const getResult = asyncHandler(async (req, res) => {
    const session_id = req.params.session_id;

    if (!session_id) {
        throw new ApiError(401, "cannot access the result");
    }

    const resultData = await Result.findOne({ session_id: session_id });

    if (!resultData) {
        throw new ApiError(401, "cannot find the result");
    }

    res.status(201).json(
        new ApiResponse(201, resultData, "successfully result are passed")
    );
});

const getReferenceLinks = asyncHandler(async (req, res) => {
    const session_id = req.params.session_id;
    // console.log(session_id);

    if (!session_id) {
        throw new ApiError(401, "cannot access the result");
    }

    const referenceLinks = await RefrenceLinks.findOne({
        session_id: session_id,
    });
    console.log(referenceLinks);

    if (!referenceLinks) {
        throw new ApiError(401, "cannot find the links");
    }

    res.status(201).json(
        new ApiResponse(201, referenceLinks, "successfully result are passed")
    );
});

export {
    history_list,
    isResumePresent,
    total_interviews,
    getResult,
    getReferenceLinks,
};
