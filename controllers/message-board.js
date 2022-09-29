let async = require("async");

let { DateTime } = require("luxon");

let User = require("../model/user");

let Message = require("../model/message");

const { body } = require("express-validator");

let messageBoardGetReq = (req, res, next) => {
    res.render("msg-board", {
        title: "Message Board",
        // createMsg: req.user.member
        createMsg: true
    });
}

let messageBoardCreateNewGetReq = (req, res, next) => {
    res.render("new-msg", {
        title: "Create A New Message"
    })
}

let messageBoardCreateNewPostReq = [
    body("msg-title", "Title can not be left empty")
        .trim().isLength({ min: 1 }).escape(),
    body("msg-body", "Body can not be left empty")
        .trim().isLength({ min: 1 }).escape(),

    (req, res, next) => {
        async.parallel(
            {
                user(cb) {
                    User.findById(req.user._id).exec(cb)
                }
            },

            (err, result) => {
                if (err) return next(err);

                let message = new Message({
                    title: req.body["msg-title"],
                    body: req.body["msg-body"],
                    author: result.user._id,
                    posted: DateTime.fromMillis(Date.now()).toLocaleString(DateTime.DATE_MED)
                })

                message.save().then((rcrd) => {

                    result.user.messages.push(rcrd._id)

                    User.findByIdAndUpdate(result.user._id, result.user, {}, err => {
                        if (err) return next(err);

                        // successfull update
                        // and now redirecting to home page
                        res.redirect("/");
                    })

                }).catch(err => next(err))
            }
        )
    }
]

let logOutGetReq = (req, res, next) => {
    req.logout()
    res.redirect("/")
}

module.exports = {
    messageBoardGetReq,
    logOutGetReq,
    // messageBoardGetReqForCreatingNewMessage
    messageBoardCreateNewGetReq,
    messageBoardCreateNewPostReq
}