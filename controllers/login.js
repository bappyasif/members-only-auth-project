// let passport = require("passport");

// let User = require("../model/user");

// let bcrypt = require("bcryptjs");

// let LocalStrategy = require("passport-local").Strategy;

const { body, validationResult } = require("express-validator")

let passport = require("../config/passport");

let loginFormGetReq = (req, res) => res.render("login-form", {title: "Login Form", errors: null})

let loginFormRePopulate = [
    body("username", "login address can not be empty")
    .trim().isLength({min: 1}).escape(),
    body("password", "user password can not be empty")
    .trim().isLength({min: 1}).escape(),

    (req, res, next) => {
        let errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render("login-form", {title: "Login Form", errors: null, username: req.body.username})
            return;
        }
        res.send("you're not supposed to be here....")
    }
]

let loginFormPostReq = passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/message-board"
})

module.exports = {
    loginFormGetReq,
    loginFormPostReq,
    loginFormRePopulate
}