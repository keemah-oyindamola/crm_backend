const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer.controller");

router.use(authenticate); // every route below requires a valid JWT

router.post("/", authorize(["ADMIN", "MANAGER"]), createCustomer);
router.get("/", getCustomers); // any authenticated role can view
router.get("/:id", getCustomerById);
router.put("/:id", authorize(["ADMIN", "MANAGER"]), updateCustomer);
router.delete("/:id", authorize(["ADMIN"]), deleteCustomer);

module.exports = router;