const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    registrationNo: {
        type: String,
        required: true,
        lowercase: true,  
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    hostelBlock: {
        type: String,
        enum: ["LH1", "LH2", "LH3", "LH4", "LH5", "MH1", "MH2", "MH3", "MH4", "MH5", "MH6", "MH7", "MH8", "MH9", "MH10"],
        required: true
    },
    roomNo: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "registrationNo"  // registrationNo se login hoga
});

module.exports = mongoose.model("User", userSchema);