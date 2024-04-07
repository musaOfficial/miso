import mongoose from "mongoose";

const WinningSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    expirationDate: {
        type: Date,
        default: Date.now // Add expiration time
    }
})

const Winning = mongoose.model.Winning || mongoose.model("Winning", WinningSchema);

export default Winning;