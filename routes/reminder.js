const express = require('express');
const router = express.Router();
const reminderCtrl = require('../controllers/reminder');

//Routes

//index
router.get('/', reminderCtrl.index);

//new route
router.get('/new', reminderCtrl.new);

//Delete route
router.delete("/:id", reminderCtrl.delete);

//Update route
router.put("/:id", reminderCtrl.update)

//create route
router.post("/", reminderCtrl.create);

//edit route
router.get ("/:id/edit", reminderCtrl.edit);

//show route
router.get ("/:id", reminderCtrl.show)

module.exports = router; 