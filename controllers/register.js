let bcrypt = require("bcryptjs");
let { body, validationResult, check } = require("express-validator");

let User = require("../model/user");

let serveUserRegistrationForm = (req, res, next) => {
    res.render("signup-form", {
        title: "Signup Form",
        errors: null,
        user: null
    })
}

let saveRegisteredUserInDatabase = [
    body("firstname", "first name can not be empty")
        .trim().isLength({ min: 1 }).escape(),
    body("lastname", "last name can not be empty")
        .trim().isLength({ min: 1 }).escape(),
    body("username", "email address can not be empty")
        .trim().isLength({ min: 1 }).escape(),
    body("password", "user password can not be empty")
        .trim().isLength({ min: 1 }).escape(),
    body("confirm", "confirm password can not be empty")
        .trim().isLength({ min: 1 }).escape(),
    // check("password").exists(),
    check("confirm", "password confirmation field must have same value as password field")
        .exists().custom((val, { req }) => val === req.body.password),

    (req, res, next) => {
        let errors = validationResult(req);

        let user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            password: req.body.password
        }

        if (!errors.isEmpty()) {
            res.render("signup-form", {
                title: "Signup Form",
                errors: errors.array(),
                user: user
            })

            return
        }

        bcrypt.hash(user.password, 9, (err, hashedPassword) => {
            if (err) return next(err);

            // updating user entry with hashed password and membership status
            user.password = hashedPassword

            let newUser = new User(user);

            newUser.save((err, result) => {
                if (err) return next(err);

                // successfull, redirect to login page
                res.redirect("/login")
            })
        })
    }
]

module.exports = {
    serveUserRegistrationForm,
    saveRegisteredUserInDatabase
}