const Listing = require("./models/listing.js");
const multer = require("multer");
const { storage } = require("./cloudConfig");

module.exports.upload = multer({ storage });

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/users/login");
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to do that!");
        return res.redirect("/listings");
    }
    next();
};
