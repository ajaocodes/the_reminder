//Import The Database Connection
const mongoose = require("./connection");

///////////////////////////////////////////
// IMPORT YOUR MODELS BELOW
///////////////////////////////////////////
const Reminder = require("../models/reminder");
const User = require("../models/user");

/////////////////////////////////
// Do your Database Operations in Below Function
/////////////////////////////////
const seed = async () => {
  //--- CODE GOES HERE

  // Drop the Database before seeding
  mongoose.connection.db.dropDatabase();
  
  const reminder = await Reminder.create([
    {title: "test 1", note: "this thing better work"},
    {title: "test 2", note: "this thing better work 2"},
    {title: "test 3", note: "this thing better work 3"},
  ])

  console.log(reminder)
    //***************************** */

    mongoose.disconnect();
  };
  
  // Wait for the DB Connection to be Established
  mongoose.connection.on("open", () => {
    // Run Seed Function
    seed();
  });