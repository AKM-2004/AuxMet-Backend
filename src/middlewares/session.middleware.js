import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asynvhandler.js";
import { Session } from "../models/interview_session.model.js";
import jwt from "jsonwebtoken";

const verifySession = asyncHandler(async (req, res, next) => {
    try {
        token = req.cookie?.sessionToken;
        if (!token) {
            throw new ApiError(401, "there is no session created");
        }
        // if you will use the jwt.decode it will just decode it will not verify like python jwt.decode here it will only decode
        const playload = jwt.verify(toekn, process.env.SESSION_TOKEN);

        if (!playload) {
            throw new ApiError(401, "there is no play load present");
        }

        const session_id = playload._id;

        const session_data = await Session.findById(session_id);

        req.session = session_data;

        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ detail: "Token expired" });
        } else {
            return res.status(401).json({ detail: "Invalid token" });
        }
    }
});


export default verifySession