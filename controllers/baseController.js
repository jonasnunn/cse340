const utilities = require("../utilities")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav();
  const accountHeader = utilities.accountHeader(res);
  // console.log(res.locals.accountData.account_type)
  res.render("index", {
    title: "Home", 
    nav,
    accountHeader
  })
}

module.exports = baseController