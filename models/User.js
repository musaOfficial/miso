import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    clerkId: {
        type: String,
        require: true,
        unique: true,
    },
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    profilePhoto: {
        type: String
    },
    username: {
        type: String,
        require: true
    },
    coins: {
        type: Number,
        default: 0
    },
    winnings: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: "Winning"}],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        require: true
    }
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;