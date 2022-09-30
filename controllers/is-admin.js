const { body, check, validationResult } = require("express-validator")

let User = require("../model/user");

let isAdminGetReq = (req, res, next) => {
    User.findById(req.session.passport.user)
    .then(result => {
        if(result.admin) {
            console.log("you're an admin already")
            res.redirect("/already-admin");
        } else {
            res.render("is-admin", {
                title: "Making User An Admin",
                errors: null,
                isLoggedIn: req?.session?.passport?.user ? true : false
            })
        }
    }).catch(err => next(err))
}

let isAdminPostReq = [
    body("passcode", "passcode can not be left empty"),
    check("passcode", "passcode needs to be matched with what is expected").exists()
    .custom(val => val.toLowerCase() === "admin"),
    (req, res, next) => {
        // console.log(req.session.passport.user, "<<>>", req.session)
        let errors = validationResult(req);
        
        if(!errors.isEmpty()) {
            res.render("is-admin", {
                title: "Making User An Admin",
                errors: errors.array(),
                isLoggedIn: req?.session?.passport?.user ? true : false
            })
            return
        }

        User.findById(req.session.passport.user)
        .then(result => {
            if(result.member) {
                User.findByIdAndUpdate(req.session.passport.user, {admin: true}, {}, (err, _) => {
                    if(err) return next(err);
        
                    // successfully updated
                    // and now redirecting to home page
                    res.redirect("/");
                })
            } else {
                res.redirect("/join-club");
            }
        })
        .catch(err => next(err))
    }
];

let checkAdminGetReq = (req, res, next) => {
    res.render("check-filler", {
        title: "Is Already An Admin",
        system_msg: "You're already an admin",
        isLoggedIn: req?.session?.passport?.user ? true : false
    })
}

module.exports = {
    isAdminGetReq,
    isAdminPostReq,
    checkAdminGetReq
}