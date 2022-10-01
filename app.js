const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

const {connectDB, db} = require("./config/database");
const { serveDefaultHomePage, homePageDeleteMessage } = require("./controllers/home");

const MongoStore = require("connect-mongo")(session);
const routes = require("./routes");

let app = express();

require("dotenv").config();

// storing session
let sessionStore = new MongoStore({
    mongooseConnection: db,
    collection: "sessions"
})

const ONE_DAY = 1000*60*60*24; // 24 hours time in millis

app.use(session({
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true, 
    store: sessionStore, 
    cookie: {maxAge: ONE_DAY}
}))

// connecting DB
connectDB()

// view folder path setup
app.set("views", path.join(__dirname, "views"));
// view engine library setup
app.set("view engine", "ejs");

// setting up public folder
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());

app.use(passport.session());

// using middlewares
app.use(express.urlencoded({extended: true}));
app.use(routes);

app.get("/", serveDefaultHomePage);
app.post("/", homePageDeleteMessage);

const PORT = process.env.PORT || 3000;

app.listen(PORT, (err) => {
    if(err) {
        console.log("Error in server setup: \n", err)
    } else {
        console.log("Server is running on PORT number: ", PORT)
    }
});