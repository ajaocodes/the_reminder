// Import Schema and Model
const {Schema, model} = require("../db/connection")

const Reminder = new Schema ({
    title: {type: String, required: true},
    note:  {type: String, required: true},
    user:  {type: Schema.Types.ObjectId, ref: "User"}
    // url: {type: String},
    // // date:{format:"date-time"},
    // priority: Boolean,
}, {timestamps: true})

const UserSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    reminder:[Reminder],
}, { timestamps: true });

/////////////////////////////////
// Define Our Model
/////////////////////////////////
const User = model("User", UserSchema)


/////////////////////////////////
// Export Our Model
/////////////////////////////////
module.exports = User