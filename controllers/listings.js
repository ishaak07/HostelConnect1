// const Listing = require("../models/listing.js");
// const { cloudinary } = require("../cloudConfig");
// //ye index route hai 
// // module.exports.index = async (req, res) => {
// //     const allListings = await Listing.find({
// //         hostelBlock: req.user.hostelBlock
// //     });
// //     res.render("listings/index.ejs", { allListings });
// // };
// module.exports.index = async (req, res) => {
//     if (!req.user) {
//         return res.redirect("/users/login");
//     }
//     const listings = await Listing.find({
//         hostelBlock: req.user.hostelBlock
//     });
//     res.render("listings/index", { listings });
// };
// module.exports.renderNewForm = (req, res) => {
//     res.render("listings/new.ejs");
// };

// //ye new listing k liye
// module.exports.createListing = async (req, res) => {
//     console.log(req.file);
//     const newListing = new Listing(req.body.listing);
//     if (req.file) {
//         newListing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//     }
//     newListing.owner = req.user._id;
//     newListing.hostelBlock = req.user.hostelBlock;
//     await newListing.save();
//     res.redirect("/listings");
// };

// module.exports.showListing = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("owner");
//     res.render("listings/show.ejs", { listing });
// };

// module.exports.renderEditForm = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listings/edit.ejs", { listing });
// };

// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
//     if (typeof req.file !== "undefined") {
//         listing.image = {
//             url: req.file.path,
//             filename: req.file.filename
//         };
//         await listing.save();
//     }
//     res.redirect(`/listings/${id}`);
// };

// module.exports.deleteListing = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     if (listing.image && listing.image.filename) {
//         await cloudinary.uploader.destroy(listing.image.filename);
//     }
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// };


const Listing = require("../models/listing.js");
const { cloudinary } = require("../cloudConfig");

// module.exports.index = async (req, res) => {
//     if (!req.user) {
//         return res.redirect("/users/login");
//     }
//     const listings = await Listing.find({
//         hostelBlock: req.user.hostelBlock
//     });
//     res.render("listings/index", { listings });
// };

module.exports.index = async (req, res) => {
    if (!req.user) {
        return res.redirect("/users/login");
    }
    
    const { search } = req.query;
    let filter = { hostelBlock: req.user.hostelBlock };
    
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }
    
    const listings = await Listing.find(filter);
    res.render("listings/index", { listings, search });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//ye new listing k liye
module.exports.createListing = async (req, res) => {
    try {
        const newListing = new Listing(req.body.listing);
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        newListing.owner = req.user._id;
        newListing.hostelBlock = req.user.hostelBlock;
        await newListing.save();
        req.flash("success", "Item reported successfully!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", "Something went wrong while posting. Try again.");
        res.redirect("/listings/new");
    }
};

module.exports.showListing = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("owner");
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    } catch (e) {
        req.flash("error", "Invalid listing ID!");
        res.redirect("/listings");
    }
};

module.exports.renderEditForm = async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    } catch (e) {
        req.flash("error", "Invalid listing ID!");
        res.redirect("/listings");
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        if (typeof req.file !== "undefined") {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
            await listing.save();
        }
        req.flash("success", "Post updated successfully!");
        res.redirect(`/listings/${id}`);
    } catch (e) {
        req.flash("error", "Invalid listing ID!");
        res.redirect("/listings");
    }
};

module.exports.deleteListing = async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Post deleted successfully!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", "Invalid listing ID!");
        res.redirect("/listings");
    }
};
