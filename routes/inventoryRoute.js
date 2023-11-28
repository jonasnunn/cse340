// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidation = require("../utilities/inv-validation")

/*************************************
GET ROUTES 
*************************************/
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
// Route to build a car view with the Id
router.get("/detail/:inv_id", utilities.handleErrors(invController.buildByInvId));
//Route to trigger the 500 error
router.get("/trigger-error", utilities.handleErrors(invController.triggerError));
// Inventory Management view
router.get("/", utilities.handleErrors(invController.buildManagementView));
// Add  class view
router.get("/addclass", utilities.checkAccountType, utilities.handleErrors(invController.buildAddClass));
// Add Inventory view
router.get("/addinv", utilities.checkAccountType, utilities.handleErrors(invController.buildAddInv));
// Get the view to manage vehicles
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
// Edit a vehicle 
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
// Delete a vehicle view
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteCarView))

/*************************************
POST ROUTES 
*************************************/
// Add a new classification 
router.post("/addclass", invValidation.addClassRules(), invValidation.checkClassData, utilities.handleErrors(invController.addClass));
// Add a new car 
router.post("/addinv", invValidation.addInvRules(), invValidation.checkInvData, utilities.handleErrors(invController.addInv));
// Edit a car
router.post("/update", invValidation.addInvRules(), invValidation.checkUpdateData, utilities.handleErrors(invController.updateInventory))
// Delete a car
router.post("/delete", utilities.handleErrors(invController.deleteInventory))


module.exports = router;