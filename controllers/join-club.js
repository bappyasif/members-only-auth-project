let async = require("async")

const { body, validationResult, check } = require("express-validator")

let User = require("../model/user");

let joinClubGetReq = (req, res, next) => {
    res.render("club-member", {
        title: "Join Club",
        errors: null
    })
}

let joinClubPostReq = [
    body("username", "user name can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("secret", "secret can not be left empty")
    .trim().isLength({min: 1}).escape(),
    body("secret", "secret can not be less than 2 chanracters long")
    .trim().isLength({min: 2, max: 4}).escape(),
    check("secret", "passcode needs to match secret code").exists()
    .custom((val) => val === 'test'),

    (req, res, next) => {
        let errors = validationResult(req);

        let username = req.body.username;

        if(!errors.isEmpty()) {
            res.render("club-member", {
                title: "Join Club",
                errors: errors.array()
            })
            return
        }

        async.parallel(
            {
                user(cb) {
                    User.find({username: username}).exec(cb)
                }
            },
            
            (err, results) => {
                if(err) return next(err);

                // results.user[0].membership_status = true
                results.user[0].member = true

                let u_id = results.user[0]._id

                User.findByIdAndUpdate(u_id, results.user[0], {}, err => {
                    if(err) return next(err);

                    // successful update
                    // and now redirecting to home page
                    res.redirect("/");
                })
            }
        )
    }
]

module.exports = {
    joinClubGetReq,
    joinClubPostReq
}