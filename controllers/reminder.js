//Import the model
const Reminder = require("../models/reminder");
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/user");

///////////////////////////
// Controller Functions
///////////////////////////

// checks if req.user exists, if not, redirect to login
const isAuthorized = (req, res, next) => {
    if (req.user){
        next()
    } else {
        res.redirect("/auth/login")
    }
}

//index reminder
const index = (isAuthorized, async (req, res) => {
    // pass req.user to our template
    res.render("reminder", {reminder: req.user.reminder})
   })
// const currentuser = await User.findOne({username: req.user.username })
//     res.render("reminder", {reminders: currentuser.reminder});
// });

//new reminder
 const newReminder = (isAuthorized, (req, res) => {
    res.render("reminder/new")
});

// Delete
const deleteReminder = (isAuthorized, async (req, res) => {
    const currentuser = await User.findOne({ username: req.user.username })
    const id = req.params.id
    const index = req.user.reminders.findIndex((reminder) => `${reminder._id}` === id)
    req.user.reminder.splice(index, 1)
    req.user.save()
    res.redirect("/reminder/index")
})

// Update
const update = (isAuthorized, async (req, res) => {
    const user = await User.findOne({ username: req.user.username })
    const id = req.params.id
    const index = req.user.reminder.findIndex((reminder) => `${reminder._id}` === id)
    req.user.reminder[index].title = req.body.title
    req.user.reminder[index].body = req.body.body
    req.user.save()
    res.redirect(`/reminder/${id}`)
})

// Create
const create = (isAuthorized,  async (req, res) => {
    // fetch up the current user
    const user = await User.findOne({ username: req.user.username })
    
    user.reminder.push(req.body)
    await user.save()
    //redirect back to home page
    res.redirect("reminder/index")
})

// Edit
const edit = (isAuthorized, async (req, res) => {
    const user = await User.findOne({ username: req.user.username })
    const id = req.params.id
    const index = req.user.reminder.findIndex((Reminder) => `${reminder._id}` === id)
    const blog = req.user.reminder[index]

    res.render("reminder/edit", {
        reminder
    })
})

// Show (HomeIn)
const show = (isAuthorized, async (req, res) => {
    const user = await User.findOne({ username: req.user.username })
    const id = req.params.id
    const index = req.user.reminder.findIndex((reminders) => `${reminder._id}` === id)
    const reminder = req.user.reminder[index]
    console.log(blog)
    res.render("reminder/show", {
        reminder
    })
})



//////////////////////////////
// Export Controller
//////////////////////////////
module.exports = {
    index,
    new: newReminder,
    delete: deleteReminder,
    update,
    create,
    edit,
    show
  };