let mongoose =  require("mongoose");

let {DateTime} = require("luxon")

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
    title: {type: Schema.Types.String, required: true},
    body: {type: Schema.Types.String, required: true},
    author: {type: Schema.Types.ObjectId, ref: "User", required: true},
    posted: {type: Schema.Types.Date, required: true}
})

MessageSchema.virtual("delete")
.get(function() {
    return this._id
})

MessageSchema.virtual("isAdmin")
.get(function() {
    return this.author.admin ? this.author.admin : false;
})

MessageSchema.virtual("author_name")
.get(function() {
    return this.author.firstname + " " + this.author.lastname
})

MessageSchema.virtual("posted_date")
.get(function() {
    return DateTime.fromJSDate(this.posted).toISODate()
})

module.exports = mongoose.model("Message", MessageSchema)