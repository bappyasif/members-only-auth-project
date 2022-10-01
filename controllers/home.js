let async = require("async");
let User = require("../model/user");
let Message = require("../model/message");
const { body, check } = require("express-validator");

let homePageGetReq = (req, res, next) => {
    // console.log(req.session.passport.user, "req.session", req.sessionID)
    async.parallel(
        {
            messages(cb) {
                Message.find().populate("author").exec(cb)
            }
        },

        (err, results) => {
            if (err) return next(err);

            // isAuthenticated, isMember, isAdmin, these logics are now done through res.local variables in routes
            res.render("home-page", {
                title: "Home Page",
                messages: results.messages
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
                    console.log("messages updated");
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
    }
]

module.exports = {
    homePageGetReq,
    homePagePostReq
}