const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, "Please Provide an email"],
        unique: [true, "Email Exist"],
    },
    name: {
        type: String,
        required: [true, "Plesae Provide name"],
        unique: false
    },
    password:{
        type: String,
        required: [true, "Plesae Provide a password"],
        unique: false,
    },
    regProgress:{
        type: Number,
        default: 0
    },
    basicDetails:{
        type: {
            link: {
                type: String,
            },
            instagramLink: {
                type: String,
            },
            twitterLink: {
                type: String,
            },
            linkedINLink : {
                type: String,
            },
            profileName: {
                type: String
            },
            profileBio: {
                type: String,
            },
        },
    }
})

module.exports = mongoose.model.Users || mongoose.model("Users", userSchema);