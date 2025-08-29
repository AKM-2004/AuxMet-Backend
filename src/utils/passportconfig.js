import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { User } from "../models/users.model.js";
import { generateAcessRefreshTokens } from "../controllers/user.controller.js";

passport.use(
    new GoogleStrategy.Strategy( //
        {
            clientID: process.env.CLIENTID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.CLIENT_URL,
        },
        async function (AccessToken, RefreshToekn, profile, cb) {
            // cb -> callback
            // cb => callback function
            let user_data = await User.findOne({ googleId: profile.id });
            const email = profile.emails[0].value;
            const userName = email.match(/^[^@]+/)[0];
            if (!user_data) {
                user_data = await User.create({
                    FullName: profile.displayName,
                    userName: userName,
                    email: email,
                    avatar: profile.photos[0].value, // google is giving the the uploaded photo link that is text
                    googleId: profile.id,
                    googleauth: true,
                });
            }

            const { accessToken, refreshToken } =
                await generateAcessRefreshTokens(user_data._id);

            return cb(null, { accessToken, refreshToken, user_data }); // this cb helps to set the req.user so that when we will call callback at that time authgoogle/callback it it will give our stratergy data
        }
    )
);
