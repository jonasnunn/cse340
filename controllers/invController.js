const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build a view of a car with the inventory id
 * ************************** */
invCont.buildByInvId = async function (req, res, next){ 
  const inv_id = req.params.inv_id
  const vehicleData = await invModel.getCarByInvId(inv_id)
  const carView = await utilities.buildCarView(vehicleData)
  let nav = await utilities.getNav()
  const carName = vehicleData[0].inv_model
  res.render("./inventory/car-details", {
    title: carName + " Details Page",
    nav,
    carView
  })
}

/* ***************************
 *  Build the management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next){ 
  const manageView = await utilities.buildManagementView()
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    manageView
  })
}

/* ***************************
 *  Build the view to add a new classification
 * ************************** */
invCont.buildAddClass = async function (req, res, next){ 
  // const addClassView = await utilities.()
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    // addClassViewView
  })
}


/* ***************************
 *  Build the view to add a new car
 * ************************** */
invCont.buildAddInv = async function (req, res, next){ 
  // const addClassView = await utilities.()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    // addClassViewView
  })
}

invCont.triggerError = function (req, res, next) {
  throw new error;
}

module.exports = invCont