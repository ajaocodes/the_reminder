///////////////////////////////
// Import Router
////////////////////////////////
const router = require("express").Router()
const bcrypt = require("bcryptjs")
const User = require("../models/user")
const Reminder = require("../models/reminder");

/////////////////////////////////
// Custom Middleware Functions
/////////////////////////////////
const addUserToRequest = async (req, res, next) => {
    // check if the user is logged in
    if (req.session.userId){
        req.user = await User.findById(req.session.userId)
        next()
    } else {
        next()
    }
}

// checks if req.user exists, if not, redirect to login
const isAuthorized = (req, res, next) => {
    if (req.user){
        next()
    } else {
        res.redirect("/auth/login")
    }
}

///////////////////////////////
// Router Specific Middleware
////////////////////////////////
router.use(addUserToRequest)

///////////////////////////////
// Router Routes
////////////////////////////////
router.get("/", (req, res) => {
    res.render("home")
})

// AUTH RELATED ROUTES

// SIGNUP ROUTE
router.get("/auth/signup", (req, res) => {
    res.render("auth/signup")
} )
router.post("/auth/signup", async (req, res) => {
    try {
        // generate our salt
        const salt = await bcrypt.genSalt(10)
        // hash the password
        req.body.password = await bcrypt.hash(req.body.password, salt)
        console.log(req.body)
        // create the new user
        await User.create(req.body)
        // res.redirect
        res.redirect("/auth/login")
    } catch(error){
        res.json(error)
    }
})

//Login Routes
router.get("/auth/login", (req, res) => {
    res.render("auth/login")
} )

router.post("/auth/login", async (req, res) => {
    try {
      // get the user
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        //check if the passwords match
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // add userId property to the session object
          req.session.userId = user._id;
          // redirect
          res.redirect("/reminder");
        } else {
          res.json({ error: "Password does not match" });
        }
      } else {
        res.json({ error: "User Doesn't Exist" });
      }
    } catch (error) {
      res.json(error);
    }
  });

//logout
router.get("/auth/logout", (req, res) => {
    // remove the userId property
    req.session.userId = null
    // redirect to main page
    res.redirect("/")
  });


////////////////////////////////////
//Reminder Routes
////////////////////////////////////

//index reminder
router.get ("/reminder", isAuthorized, async (req, res) => {
    // pass req.user to our template
    res.render("reminder", {reminder: req.user.reminder})
   })

//new reminder
 router.get ("/reminder/new", isAuthorized, (req, res) => {
    res.render("reminder/new")
});

// Delete
 router.delete ("/:id", isAuthorized, async (req, res) => {
    const id = req.params.id
    const user = await User.findOne({ username: req.user.username })
    const index = req.user.reminder.findIndex((reminder) => { id === `${reminder._id}`})
    user.reminder.splice(index, 1)
    await user.save()
    res.redirect("/reminder")
  });

// Update
router.put ("/:id", isAuthorized, async (req, res) => {
    const user = await User.findOne({ username: req.user.username })
    const id = req.params.id
    const index = req.user.reminder.findIndex((reminder) => `${reminder._id}` === id)
    req.user.reminder[index].title = req.body.title
    req.user.reminder[index].body = req.body.body
    req.user.save()
    res.redirect(`/reminder/${id}`)
})

// Create
router.post ( "/reminder", isAuthorized,  async (req, res) => {
    // fetch up the current user
    const user = await User.findOne({ username: req.user.username })
    
    user.reminder.push(req.body)
    await user.save()
    res.redirect("/reminder")
})

// Edit
router.get("/:id/edit", isAuthorized, async (req, res) => {
    const user = await User.findOne({ username: req.user.username })
    const id = req.params.id
    const index = req.user.reminder.findIndex((reminder) => `${reminder._id}` === id)
    const reminder =req.user.reminder[index]
    console.log(reminder)
    res.render("reminder edit", {reminder})
})

// res.send("edit page")})

// Show (reminder page)
router.get ("/:id",isAuthorized, async (req, res) => {
    const user = await User.findOne({ username: req.user.username })
    const id = req.params.id
    const index = req.user.reminder.findIndex((reminder) => `${reminder._id}` === id)
    const reminders = req.user.reminder[index]
    res.render("reminder/show", {reminders})
     })



///////////////////////////////
// Export Router
////////////////////////////////
module.exports = router