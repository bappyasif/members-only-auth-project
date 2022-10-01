let passport = require("passport");
let bcrypt = require("bcryptjs");
let LocalStrategy = require("passport-local").Strategy;

let User = require("../model/user");

let verifyCallback = (username, password, done) => {
    User.findOne({username: username}, (err, user) => {
        if(err) return done(err);

        if(!user) return done(null, false, {message: "Incorrect Username"})

        bcrypt.compare(password, user.password, (err, result) => {
            if(err) return done(err)

            if(result) {
                // password matched
                // console.log("<<matched>>")

                return done(null, user)
            } else{
                // password mismatched
                // console.log("<<didnt match>>")

                return done(null, false, {message: "Password Incorrect"})
            }
        })
    })
}

let strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((userId, done) => {
    User.findById(userId)
    .then(user => done(null, user))
    .catch(err => done(err))
})

module.exports = passport