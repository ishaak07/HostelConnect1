const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner, upload } = require("../middleware.js");
const Listing = require("../models/listing.js");
const listingController = require("../controllers/listings.js");

//INDEX ROUTE
router.get("/",listingController.index);


//NEW FORM ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

//CREATE ROUTE
router.post("/", isLoggedIn, upload.single("image"), listingController.createListing);

//ye detailed view
router.get("/:id", listingController.showListing);
router.get("/:id/edit",isLoggedIn,isOwner, listingController.renderEditForm);
router.put("/:id", isLoggedIn,isOwner,upload.single("image"),listingController.updateListing);
router.delete("/:id", isLoggedIn,isOwner,listingController.deleteListing);

//img

module.exports = router;