import passport from "passport";
import { Router } from "express";
import "../utils/passportconfig.js";
import ApiResponse from "../utils/apiResponse.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    userLogin,
    userLogout,
    UserRegister,
    refreshaccesstoken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserdetails,
    updateUserAvatar,
    updateUserCover,
} from "../controllers/user.controller.js";

const router = Router();

// use headers here for authorization

router
    .route("/auth/google") // this route for what we want
    .get(
        passport.authenticate("google", {
            scope: ["profile", "email"],
            session: false,
        })
    );

router.route("/auth/google/callback").get(
    // this for runnig the callback
    passport.authenticate("google", {
        failureRedirect: "http://localhost:5173/",
        session: false,
    }),
    (req, res) => {
        const { accessToken, refreshToken, user_data } = req.user;
        const options = {
            httpOnly: true,
            secure: true,
        };

        res.status(201)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect(`${process.env.FRONT_END_LINK}/dashboard`);
    }
);

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        {
            name: "cover",
            maxCount: 1,
        },
    ]),
    UserRegister
); // fields because for uploading the the multiple filesand, multer assigns the req.file object

router.route("/login").post(userLogin);
// secured routes : yaha pe user logged in hona chaiye
router.route("/logout").post(verifyUser, userLogout); // you can user middle ware whenever youwant
// next ka yahi faida hai ki abhi khatam hua to next ko bhejo
router.route("/refresh-token").post(refreshaccesstoken);
router.route("/change-password").post(verifyUser, changeCurrentPassword);
router.route("/current-user").get(verifyUser, getCurrentUser);
router.route("/update-account").patch(verifyUser, updateUserdetails);

router
    .route("/update-avatar")
    .patch(verifyUser, upload.single("avatar"), updateUserAvatar);
router
    .route("/update-cover")
    .patch(verifyUser, upload.single("cover"), updateUserCover);

export default router;
