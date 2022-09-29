let async = require("async");
let User = require("../model/user");
let Message = require("../model/message");
const { body, check } = require("express-validator");

let homePageGetReq = (req, res, next) => {
    console.log(req.session.passport.user, "req.session", req.sessionID)
    async.parallel(
        {
            currentlyLoggedInUser(cb) {
                User.findById(req.session.passport.user).exec(cb)
            },

            messages(cb) {
                Message.find().populate("author").exec(cb)
            }
        },

        (err, results) => {
            if (err) return next(err);

            // console.log(results.currentlyLoggedInUser, "results.currentlyLoggedInUser")

            // console.log(results.messages)

            res.render("home-page", {
                title: "Home Page",
                // users: results.users,
                messages: results.messages,
                loggedIn: results.currentlyLoggedInUser?.member,
                isAdmin: results.currentlyLoggedInUser?.admin
            })
        }
    )
}

let homePagePostReq = [
    check("delete").exists(),
    (req, res, next) => {
        // console.log(req.session.passport.user, "{}{}", req.body)

        User.findById(req.session.passport.user)
            .then(result => {
                let filteredMessages = result.messages.filter(val => val.toString() !== req.body.delete)
                result.messages = filteredMessages;
                // console.log(result, "<<>>")
            }).catch(err => next(err))
            .finally(() => {
                Message.findByIdAndDelete(req.body.delete)
                    .then(() => {
                        console.log("Delete successful");
                        res.redirect("/")
                    })
            })

        // Message.findByIdAndDelete(req.body.delete)
        // .then(() => {
        //     console.log("Delete successful");
        //     res.redirect("/")
        // })
        // res.redirect("/")
    }
]

// let homePageGetReq = (req, res, next) => {
//     console.log(req.session, "req.session", req.sessionID)
//     User.find()
//     .then(users => {
//         res.render("home-page", {
//             title: "Home Page",
//             users: users,
//             loggedIn: req.session.passport.user, 
//         })
//     }).catch(err => console.log(err))
// }

module.exports = {
    homePageGetReq,
    homePagePostReq
}