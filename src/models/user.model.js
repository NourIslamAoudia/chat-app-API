import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    fullName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profilPic:{
        type: String,
        default: ""
    }
},{
    timestamps: true
});

const User = mongoose.model('User', userSchema);//first caracter is uppercase

export default User;