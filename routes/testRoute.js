const express = require("express")
const router = new express.Router() 
const testController = require("../controllers/testController")


//Route to trigger the 500 error
router.get("/", testController.triggerError)

