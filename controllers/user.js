const User = require("../models/user.js");

// RENDER SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};
module.exports.signup = async (req, res) => {
    try {
        let { username, email, hostelBlock, password } = req.body;
        const newUser = new User({
            email,
            hostelBlock,
            username
        });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });

    } catch (e) {
        console.log(e);
        res.redirect("/users/signup");
    }
};

// RENDER LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};
module.exports.login = async (req, res) => {
    res.redirect("/");
};
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};