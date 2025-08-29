import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const Connection = await mongoose.connect(
            `${process.env.MONGODB_URI}`,

            {
                dbName: process.env.DB_NAME,
            }
        );
        console.log(
            `MONGODB connected :: DB_HOST :: ${Connection.connection.host}`
        );
        console.log("DB Name:", Connection.connection.name);
    } catch (error) {
        console.log("MONGODB Connection ERROR :", error);
        process.exit(1);
    }
};

export { connectDB };
