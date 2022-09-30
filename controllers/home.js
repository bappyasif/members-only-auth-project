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

            console.log(results.currentlyLoggedInUser, "results.currentlyLoggedInUser")

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

        Message.findById(req.body.delete)
        .then(result => {
            User.findById(result.author)
            .then(data => {
                let filteredMessages = data.messages.filter(val => val.toString() !== req.body.delete)
                data.messages = filteredMessages;

                User.findByIdAndUpdate(result.author, data, {}, err => {
                    if(err) return next(err);
                    // successfully updated filtered messages to reflect deleted message from list
                    console.log("messages in user data is updated");
                })
            })
        }).catch(err => next(err))
        .finally(() => {
            Message.findByIdAndDelete(req.body.delete)
                    .then(() => {
                        console.log("Delete successful");
                        res.redirect("/")
                    })
        })

        // User.findById(req.session.passport.user)
        //     .then(result => {
        //         let filteredMessages = result.messages.filter(val => val.toString() !== req.body.delete)
        //         result.messages = filteredMessages;
        //         console.log(result, "<<>>")
        //         User.findByIdAndUpdate(req.session.passport.user, result, {}, (err) => {
        //             if(err) return next(err);

        //             // update user with updated messages list
        //             // and now redirecting to home page
        //             // res.redirect("/");
        //             console.log("updated", result)
        //         })
        //     }).catch(err => next(err))
        //     .finally(() => {
        //         Message.findByIdAndDelete(req.body.delete)
        //             .then(() => {
        //                 console.log("Delete successful");
        //                 res.redirect("/")
        //             })
        //     })
    }
]

module.exports = {
    homePageGetReq,
    homePagePostReq
}