const mongoose=require("mongoose");
const express=require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const app=express();
const port=8080;
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const User = require("./models/user.js");
const userRoutes = require("./routes/user.js");
const listingRoutes = require("./routes/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/HostelConnect";
mongoose.connect(MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

app.use("/users", userRoutes);
app.use("/listings", listingRoutes);

app.get("/", (req, res) => {
  res.send("HostelConnect working");
});

app.listen(port,()=>{
    console.log(`app listening to port ${port}`);
});