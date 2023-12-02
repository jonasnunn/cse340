const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const accountHeader = utilities.accountHeader(res);
    res.render("account/login", {
      title: "Login",
      nav,
      accountHeader,
      errors: null,
    })
}
  
/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  const accountHeader = utilities.accountHeader(res);
  res.render("account/register", {
    title: "Register",
    nav,
    accountHeader,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const accountHeader = utilities.accountHeader(res);
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      accountHeader,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const accountHeader = utilities.accountHeader(res);
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    accountHeader,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}


/* ****************************************
*  Deliver account management view 
* *************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  const accountHeader = utilities.accountHeader(res);
  let manageView = null;
  if (res.locals.accountData.account_type == 'Admin' || res.locals.accountData.account_type == 'Employee' )
  {
    manageView = `<h2>Welcome ${res.locals.accountData.account_firstname}</h2>
    <p>You're logged in</p>
    <a href="/account/edit/${res.locals.accountData.account_id}">Manage Account Information</a>
    <h3>Inventory Management</h3>
    <p><a href="/inv">Manage Inventory</a></p>`
  }
  else if (res.locals.accountData.account_type == 'Client')
  {
    manageView = `<h2>Welcome ${res.locals.accountData.account_firstname}</h2>
    <p>You're logged in</p>
    <a href="/account/edit/${res.locals.accountData.account_id}">Manage Account Information</a>`
  }
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountHeader,
    manageView,
    errors: null,
  })
}


/* ****************************************
*  Handle Updating the account information
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  const accountHeader = utilities.accountHeader(res);
  res.render("account/login", {
    title: "Login",
    nav,
    accountHeader,
    errors: null,
  })
}


/* ****************************************
*  Make the view to edit the account information 
* *************************************** */
async function editAccountView(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const accountHeader = utilities.accountHeader(res);
  let accountData = await accountModel.getAccountById(account_id);
  // console.log("TEST: accountData")
  // console.log(accountData)
  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    accountHeader,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id,
  })
}


/* ****************************************
*  Process updating an accounts information
* *************************************** */
async function processAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const accountHeader = utilities.accountHeader(res);
  const { account_firstname, account_lastname, account_email, account_id} = req.body
  
  // console.log("Before Model TEST:")
  // console.log(`account_firstname ${account_firstname}`)
  // console.log(`account_lastname ${account_lastname}`)
  // console.log(`account_email ${account_email}`)
  // console.log(`account_id ${account_id}`)

  const updateResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    req.flash("notice", `The account was successfully updated.<br>
    First Name: ${updateResult.account_firstname}<br>
    Last Name: ${updateResult.account_lastname}<br>
    Email: ${updateResult.account_email}`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/edit-account", {
    title: "Edit Account",
    nav,
    accountHeader,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    account_id
    })
  }
}

/* ****************************************
*  Process updating a password
* *************************************** */
async function processPasswordUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const accountHeader = utilities.accountHeader(res);
  const { account_id, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error hashing the password.')
    res.status(500).render("account/edit-account", {
      title: "Edit Account",
      nav,
      accountHeader,
      errors: null,
    })
  }
  
  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)
  console.log("updateResult")
  console.log(updateResult)
  if (updateResult) {
    req.flash("notice", `The password was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).render("account/edit-account", {
    title: "Edit Account",
    nav,
    accountHeader,
    errors: null,
    account_id
    })
  }
}


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, editAccountView, processAccountUpdate, processPasswordUpdate}