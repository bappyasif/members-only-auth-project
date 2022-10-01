let isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        console.log("authenticated");
        next()
    } else {
        console.log("not authenticated");
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

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 * rather than using individual function for them it's betetr to have them in same function
 * setting up res.locals variables and then returning middleware to next 
 */
let setAuthenticationVariables = (req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.isMember = req.user?.member;
    res.locals.isAdmin = req.user?.admin;
    return next();
}

module.exports = {
    isAuth,
    isMember,
    setAuthenticationVariables
}