import express from "express";

const customerRouter = express.Router();

import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
} from "../controllers/customer.controller";

customerRouter.get("/", getAllCustomers);

customerRouter.get("/:customerId", getCustomer);

customerRouter.post("/", createCustomer);

customerRouter.delete("/:customerId", deleteCustomer);

customerRouter.put("/:customerId", updateCustomer);

export default customerRouter;
