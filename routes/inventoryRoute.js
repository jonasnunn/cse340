// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build a car view with the Id
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId));
//Route to trigger the 500 error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));
// Inventory Management view
router.get("/", utilities.handleErrors(invController.buildManagementView));
// Add  class view
router.get("/addclass", utilities.handleErrors(invController.buildAddClass));
// Add Inventory view
router.get("/addinv", utilities.handleErrors(invController.buildAddInv));

module.exports = router;