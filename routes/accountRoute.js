const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index")
const accountsController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation');

router.get("/login", utilities.handleErrors(accountsController.buildLogin))
router.get("/register", utilities.handleErrors(accountsController.buildRegister))

// ADD NEW ACCOUNT
router.post('/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountsController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;