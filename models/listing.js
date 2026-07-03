const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    image: {
        url: String,
        filename: String,
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    hostelBlock: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
    type: Date,
    default: () => Date.now() + 5 * 24 * 60 * 60 * 1000
    }
});

module.exports = mongoose.model("Listing", listingSchema);