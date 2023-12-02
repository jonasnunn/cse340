const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index")
const accountsController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

// Get requests 
router.get("/", utilities.checkLogin ,utilities.handleErrors(accountsController.buildAccountManagement))
router.get("/login", utilities.handleErrors(accountsController.buildLogin))
router.get("/register", utilities.handleErrors(accountsController.buildRegister))
router.get("/edit/:account_id", utilities.handleErrors(accountsController.editAccountView))
router.get("/change-password/:account_id", utilities.handleErrors(accountsController.editAccountView))

// Add new account
router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountsController.registerAccount))
// Process the login attempt
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData,  utilities.handleErrors(accountsController.accountLogin));
// Edit an account
router.post("/update", regValidate.registrationRules(), regValidate.checkUpdateData, utilities.handleErrors(accountsController.processAccountUpdate))
// Update the password
router.post("/update-password", regValidate.passwordRules(), regValidate.checkPassword, utilities.handleErrors(accountsController.processPasswordUpdate))

module.exports = router;