// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build a car view with the Id
router.get("/detail/:invId", invController.buildByCarId)

module.exports = router;