const dns = require("dns");

const mongoose=require("mongoose");
const express=require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const deleteExpiredListings = require("./utils/cleanup");
const ejsMate = require("ejs-mate");
const { isLoggedIn } = require("./middleware.js");
const Listing = require("./models/listing.js");

const app=express();
const port=8080;
const path=require("path");
app.set("view engine","ejs");
app.engine("ejs", ejsMate);
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const User = require("./models/user.js");
const userRoutes = require("./routes/user.js");
const listingRoutes = require("./routes/listing.js");

const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 90 * 24 * 60 * 60 * 1000 
    }
};
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy( { usernameField: "registrationNo" },User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});


app.use("/users", userRoutes);
app.use("/listings", listingRoutes);
app.get("/profile", isLoggedIn, async (req, res) => {
    const listings = await Listing.find({ owner: req.user._id });
    res.render("users/profile.ejs", { listings });
});


app.get("/", (req, res) => {
    res.redirect("/listings");
});
setInterval(() => {
    deleteExpiredListings();
}, 60 * 60 * 1000); 

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(port,()=>{
    console.log(`app listening to port ${port}`);
});