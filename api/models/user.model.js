import { mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requires: true,
        unique: true
    },
    password: {
        type: String,
        requires: true,
    },
    email: {
        type: String,
        requires: true,
        unique: true 
    },
    avatar: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;