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

invCont.triggerError = function (req, res, next) {
  throw new error;
  // next({
  //   status: 500,
  //   message: "We did it! We got a 500 error!"})
}

module.exports = invCont