const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } 
  catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get a car given a specific Id
 * ************************** */
async function getCarByInvId(car_Id){
  try {
    const data = await pool.query(
    `SELECT * FROM public.inventory AS i 
    WHERE i.inv_id = $1`,
    [car_Id])
  return data.rows
} 
catch (error) {
    console.error("getCarByInvId error" + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarByInvId};
