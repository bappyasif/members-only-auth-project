let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    firstname: {type: Schema.Types.String, required: true},
    lastname: {type: Schema.Types.String, required: true},
    username: {type: Schema.Types.String, required: true},
    password: {type: Schema.Types.String, required: true},
    member: {type: Schema.Types.Boolean},
    // messages: {type: Schema.Types.Array}
    messages: [{type: Schema.Types.ObjectId, ref: "Message"}],
    admin: {type: Schema.Types.Boolean}
})

module.exports = mongoose.model("User", UserSchema);

// module.exports = UserSchema