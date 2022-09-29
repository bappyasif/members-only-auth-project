let isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        console.log("authenticated")
        next()
    } else {
        console.log("not authenticated")
        res.status(401).json({msg: "not authorized to access this document"})
    }
}

let isMember = (req, res, next) => {
    if(req.isAuthenticated() && req.user.member) {
        console.log("is member")
        next();
    } else {
        console.log("not member")
        res.status(401).json({msg: "not a member to post message"})
    }
}

module.exports = {
    isAuth,
    isMember
}