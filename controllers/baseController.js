const utilities = require("../utilities")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav();
  const loggedIn = res.locals.loggedin
  if (loggedIn){
    accountHTML = `
    <a title="Click to Manage Inventory" href="/inv">Welcome Basic</a>
    <a title="Click to logout" href="/account/logout">Logout</a>`
  }
  else{ accountHTML = `<a title="Click to log in" href="/account/login">My Account</a>` }
  res.render("index", {
    title: "Home", 
    nav,
    accountHTML
  })
}

module.exports = baseController