const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig");

const deleteExpiredListings = async () => {
    const now = new Date();
    const expiredListings = await Listing.find({expiresAt: { $lt: now }});
    for (let listing of expiredListings) {
        //delete image from cloudinary
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        // delete from DB
        await Listing.findByIdAndDelete(listing._id);
    }
    console.log(`${expiredListings.length} expired listings deleted`);
};
module.exports = deleteExpiredListings;