const mongoose = require("mongoose");
const UserSchema = require("../model/user");

require("dotenv").config();

let conn = process.env.DB_STRING;

mongoose.connect(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=> console.log("db connected...."));

let db = mongoose.connection;

let connectDB = () => {
    db.on("error", console.error.bind(console, "mongo db connection error!!"))
}

module.exports = {
    connectDB,
    db
}