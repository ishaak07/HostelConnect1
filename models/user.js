const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    hostelBlock: {
        type: String,
        enum: ["LH1", "LH2", "LH3", "MH1", "MH2","MH3","MH4","MH5","MH6","MH7"],
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

