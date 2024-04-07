import React from "react";
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Successfully connected to MONGODB :)");
    }
    catch (err) {
        console.log(err);
    }
}