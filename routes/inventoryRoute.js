// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Inventory Management view
router.get("/", utilities.handleErrors(invController.buildManagementView));
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build a car view with the Id
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId));
//Route to trigger the 500 error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));

module.exports = router;