import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";

const verifyUser = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "accessToken not found");
    }
    try {
        const playload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(playload._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ detail: "Token expired. Please login again." });
        } else {
            return res.status(401).json({ detail: "Invalid token" });
        }
    }
});

// const CheckCurrentuser = asyncHandler((req, res, next)=>{
//   const token = req.cookies?.access_token; // get cookie

//   if (!token) {
//     return res.status(401).json({ detail: "Not authenticated" });
//   }

//   try {
//     const payload = jwt.verify(token, SECRET_KEY); // verify & decode
//     req.user = payload; // attach user to request object
//     next(); // move to next middleware/route
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({ detail: "Token expired. Please login again." });
//     } else {
//       return res.status(401).json({ detail: "Invalid token" });
//     }
//   }
// })

export { verifyUser };
