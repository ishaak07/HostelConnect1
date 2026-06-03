const express = require("express");
const router = express.Router();
const { isLoggedIn, isOwner } = require("../middleware.js");
const Listing = require("../models/listing.js");
const listingController = require("../controllers/listings.js");

//INDEX ROUTE
router.get("/", listingController.index);

//NEW FORM ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

//CREATE ROUTE
router.post("/", isLoggedIn, listingController.createListing);

//ye detailed view
router.get("/:id", listingController.showListing);
router.get("/:id/edit",isLoggedIn,isOwner, listingController.renderEditForm);
router.put("/:id", isLoggedIn,isOwner,listingController.updateListing);
router.delete("/:id", isLoggedIn,isOwner,listingController.deleteListing);
module.exports = router;