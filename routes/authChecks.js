let isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        console.log("authenticated", req);
        // res.locals.isAuthenticated = isAuthenticated();
        next()
    } else {
        console.log("not authenticated");
        // res.locals.isAuthenticated = isAuthenticated();
        res.status(401).json({msg: "not authorized to access this document"})
    }
}

let isMember = (req, res, next) => {
    if(req.isAuthenticated() && req.user.member) {
        console.log("is member")
        // res.locals.isMember = req.user.member;
        next();
    } else {
        console.log("not member")
        // res.locals.isMember = req.user.member;
        res.status(401).json({msg: "not a member to post message"})
    }
}

let isAuthenticated = (req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    return next();
}

let clubMember = (req, res, next) => {
    res.locals.isMember = req.user?.member;
    return next();
}

module.exports = {
    isAuth,
    isMember,
    isAuthenticated,
    clubMember
}