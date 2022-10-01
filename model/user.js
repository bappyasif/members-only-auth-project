let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    firstname: {type: Schema.Types.String, required: true},
    lastname: {type: Schema.Types.String, required: true},
    username: {type: Schema.Types.String, required: true},
    password: {type: Schema.Types.String, required: true},
    member: {type: Schema.Types.Boolean},
    // this is not really practical to keep all user messages ids in here as well
    // as we are already storing "user" reference in "message" it's rather redundant and less effective to keep refernce to those messages here as well
    // it rather becomes, keeping record of "1 to many" and "many to 1"
    // which is not expected, so just keeping refrence in "message" (i.e. many's side), is more than sufficient enough
    messages: [{type: Schema.Types.ObjectId, ref: "Message"}], // keeping this for learning purpose for now
    admin: {type: Schema.Types.Boolean}
})

module.exports = mongoose.model("User", UserSchema);