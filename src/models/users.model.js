import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserModel = new mongoose.Schema(
    {
        userName: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        FullName: {
            type: String,
            required: true,
        },
        avatar: {
            // here we will use cloudnary url;
            type: String,
            trim: true,
        },
        coverImage: {
            type: String,
        },
        password: {
            type: String,
        },
        googleId: {
            type: String,
        },
        googleauth: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

UserModel.pre("save", async function (next) {
    //before saving converting it to the encription format

    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next(); // next go into the db
});

UserModel.methods.isPasswordCorrect = function (password) {
    return bcrypt.compare(password, this.password);
};

UserModel.methods.generateAccessToken = function () {
    //console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            FullName: this.FullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

UserModel.methods.generateRefreshToekn = function () {
    //console.log(process.env.REFRESH_TOKEN_SECRET);
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

const User = mongoose.model("User", UserModel);

export { User };
