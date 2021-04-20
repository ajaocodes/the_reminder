// Import Schema and Model
const {Schema, model} = require("../db/connection")

const reminderSchema = new Schema ({
    title: {type: String, required: true},
    note:  {type: String, required: true},
    // url: {type: String},
    // // date:{format:"date-time"},
    // priority: Boolean,
}, {timestamps: true})

/////////////////////////////////
// Define Our Model
/////////////////////////////////
const Reminder = model("Reminder", reminderSchema)
/////////////////////////////////
// Export Our Model
/////////////////////////////////
module.exports = Reminder