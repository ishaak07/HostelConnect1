const Listing = require("../models/listing.js");

//ye index route hai 
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({
        hostelBlock: req.user.hostelBlock
    });
    res.render("listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//ye new listing k liye
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.hostelBlock = req.user.hostelBlock;
    await newListing.save();
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};