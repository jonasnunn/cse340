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

invCont.buildByCarId = async function (req, res, next){ 
  const car_Id = req.params.invId
  const data = await invModel.getCarByInvId(car_Id)
  const carView = await utilities.buildCarView(data)
  let nav = await utilities.getNav()
  const carName = data[0].inv_model
  res.render("./inventory/car-details", {
    title: carName + " Details Page",
    nav,
    carView
  })
}


module.exports = invCont