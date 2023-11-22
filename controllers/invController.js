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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    manageView,
    classificationSelect
  })
}

/* ***************************
 *  Build the view to add a new classification
 * ************************** */
invCont.buildAddClass = async function (req, res, next){ 
  // const addClassView = await utilities.()
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    errors: null,
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
  const classification_list = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    errors: null,
    title: "Add Inventory",
    nav,
    classification_list
    // addClassViewView
  })
}

/* ****************************************
*  Process adding a new classification
* *************************************** */
invCont.addClass = async function (req, res) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  const addClassification = await invModel.addClass(classification_name)

  if (addClassification) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${classification_name}.`
    )
    const manageView = await utilities.buildManagementView()
    res.status(201).render("inventory/management", {
      title: "Management ",
      nav,
      manageView,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, adding the car failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process adding a new car
* *************************************** */
invCont.addInv = async function (req, res) {
  let nav = await utilities.getNav()
  const manageView = await utilities.buildManagementView()
  const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body

  const addInv = await invModel.addInv(
    classification_id,
    inv_make, 
    inv_model, 
    inv_year,
    inv_description, 
    inv_image, 
    inv_thumbnail,
    inv_price, 
    inv_miles,
    inv_color
  )

  if (addInv) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${inv_model}.`
    )
    res.status(201).render("inventory/management", {
      title: "Management",
      nav,
      manageView
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    })
  }
}

invCont.triggerError = function (req, res, next) {
  throw new error;
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Makes the view to update a car
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getCarByInvId(inv_id)
  itemData = itemData[0]
  const classification_list = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classification_list: classification_list,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ****************************************
*  Process updating a cars information
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* ***************************
 *  Delete view for a car
 * ************************** */
invCont.deleteCarView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getCarByInvId(inv_id)
  itemData = itemData[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}


/* ****************************************
*  Delete a car
* *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id } = req.body
  const updateResult = await invModel.deleteInventory(inv_id)

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}


module.exports = invCont