import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { uploadOnCloudnary, deleteFromCloudnary } from "../utils/cloudnary.js";
import GoogleStrategy from "passport-google-oauth20";
import passport from "passport";

const generateAcessRefreshTokens = async (userId) => {
    // console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(
            500,
            "not able to generate the access token and refresh tokens"
        );
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToekn();
    // console.log(accessToken + " in " + refreshToken);
    return { accessToken, refreshToken };
};

const UserRegister = asyncHandler(async (req, res) => {
    const { fullName, userName, email, password } = req.body;

    if (
        [fullName, userName, email, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required to fill");
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }],
    });

    if (existedUser) {
        throw new ApiError(409, "user is already existed");
    }

    const avatarlocal = req.files?.avatar?.[0]?.path;
    const coverlocal = req.files?.cover?.[0]?.path;

    console.log(avatarlocal, coverlocal);

    let avatar = null;
    let cover = null;

    if (avatarlocal) {
        avatar = await uploadOnCloudnary(avatarlocal);
    }
    if (coverlocal) {
        cover = await uploadOnCloudnary(coverlocal);
    }

    const createduser = await User.create({
        FullName: fullName,
        userName: userName,
        password: password,
        email: email,
        avatar: avatar?.url || "",
        coverImage: cover?.url || "",
    });

    const user = await User.findById(createduser._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(500, "user can't be regiseter");
    }
    console.log(user._id);
    const { accessToken, refreshToken } = await generateAcessRefreshTokens(
        user._id
    );
    createduser.refreshToken = refreshToken;
    await createduser.save({ validateBeforeSave: false }); // this will save this data into the mongo db

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: ".auxmet.com", // <-- works for api.auxmet.com & apibot.auxmet.com
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, user, "User registered successfully"));
});

const userLogin = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;

    if (!(userName || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }],
    }); // we will get bson with mongo methods on it

    if (user.googleId) {
        throw new ApiError(302, "continue with google ");
    }
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isCorrectPassword = await user.isPasswordCorrect(password);

    if (!isCorrectPassword) {
        throw new ApiError(400, "user password is incorrect");
    }
    const { accessToken, refreshToken } = await generateAcessRefreshTokens(
        user._id
    );
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // it will not run that
    const loginuser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: ".auxmet.com", // <-- works for api.auxmet.com & apibot.auxmet.com
        
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loginuser,
                    accessToken,
                    refreshToken,
                },
                "successFully login"
            )
        );
});

const userLogout = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        { $unset: { refreshToken: "" } },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        domain: ".auxmet.com", // <-- works for api.auxmet.com & apibot.auxmet.com
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logout successfully"));
});

const refreshaccesstoken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }
    // console.log(process.env.REFRESH_TOKEN_SECRET);
    // console.log(incomingRefreshToken);
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new ApiError(401, "user not found inside the db");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh toeken is expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            domain: ".auxmet.com", // <-- works for api.auxmet.com & apibot.auxmet.com
        };
        const { accessToken, refreshToken } = await generateAcessRefreshTokens(
            user._id
        );
        const newrefreshToken = refreshToken;
        user.refreshToken = newrefreshToken;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newrefreshToken },
                    "Access token is refreshed successfully"
                )
            );
    } catch (err) {
        throw new ApiError(401, `can't generate access token ${err}`);
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(401, "user not found");
    }

    const verifypassword = user.isPasswordCorrect(oldPassword);

    if (!verifypassword) {
        throw ApiError(404, "Password is incorrect!");
    }

    user.password = newPassword;
    await user.save();

    return res
        .status(201)
        .json(new ApiResponse(200, {}, "password is changed.."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select(
        "-password -refreshToken"
    );
    if (!user) {
        throw new ApiError(404, "user not found ");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "this is current user"));
});

const updateUserdetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(404, "user not found");
    }

    const { userName, fullName, email } = req.body;

    if (fullName !== user.FullName) {
        user.FullName = fullName;
        await user.save();
    }
    if (email !== user.email) {
        user.email = email;
        await user.save().catch(() => {
            throw new ApiError(
                401,
                "Already this Email exists try with another one"
            );
        });
    }
    if (userName !== user.userName) {
        user.userName = userName;
        await user
            .save()
            .then()
            .catch(() => {
                throw new ApiError(
                    401,
                    "Already this userName exists try with another one"
                );
            });
    }

    return res
        .status(201)
        .json(new ApiResponse(200, user, "Updated the userdetails"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    // => new avatar
    // => multer => cloudnary => take old avatar url => update mongoDB
    // => unlink from both multer and cloudnary old avatar
    // response

    // we can get re.file bcoz multer add this in req object
    const avatarlocalpath = req.file?.path;

    if (!avatarlocalpath) {
        throw new ApiError(400, "avatar file not found");
    }

    const avatar = await uploadOnCloudnary(avatarlocalpath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading Avatar");
    }
    const oldAvatar = req.user?.avatar;
    deleteFromCloudnary(oldAvatar);
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url,
            },
        },
        { new: true }
    );
    if (!user) {
        throw new ApiError(400, "Error while uploading Avatar");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "avatar has been updated"));
});

const updateUserCover = asyncHandler(async (req, res) => {
    // => new avatar
    // => multer => cloudnary => take old avatar url => update mongoDB
    // => unlink from both multer and cloudnary old avatar
    // response

    // we can get re.file bcoz multer add this in req object
    const coverlocalpath = req.file?.path;

    if (!coverlocalpath) {
        throw new ApiError(400, "coverImage file not found");
    }

    const cover = await uploadOnCloudnary(coverlocalpath);

    if (!cover.url) {
        throw new ApiError(400, "Error while uploading coverImage");
    }
    const oldCover = req.user?.coverImage;
    deleteFromCloudnary(oldCover);
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: cover.url,
            },
        },
        { new: true }
    );
    if (!user) {
        throw new ApiError(400, "Error while uploading Avatar");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Image has been updated"));
});

export {
    userLogin,
    userLogout,
    UserRegister,
    refreshaccesstoken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserdetails,
    updateUserAvatar,
    updateUserCover,
    generateAcessRefreshTokens,
};
