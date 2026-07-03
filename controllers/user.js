const User = require("../models/user.js");

// RENDER SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/listings");
    }
    res.render("users/signup.ejs");
};
module.exports.signup = async (req, res,next) => {
    try {
        let { name, registrationNo, email, hostelBlock,roomNo, password } = req.body;
        registrationNo = registrationNo.toLowerCase().trim();
        
        const newUser = new User({
            name, 
            registrationNo,
            email,
            hostelBlock,
            roomNo
        });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to HostelConnect!");
            res.redirect("/listings");
        });

    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/users/signup");
    }
};

// RENDER LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/listings");
    }
    res.render("users/login.ejs");
};
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
};
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/users/login");
    });
};