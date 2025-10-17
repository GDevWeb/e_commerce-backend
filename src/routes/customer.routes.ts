import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomer,
  updateCustomer,
} from "../controllers/customer.controller";
import { validate } from "../middlewares/validate";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "../schemas/customer.schema";

const customerRouter = express.Router();

customerRouter.get("/", getAllCustomers);

customerRouter.get("/:id", getCustomer);

customerRouter.post("/", validate(createCustomerSchema), createCustomer);

customerRouter.delete("/:id", deleteCustomer);

customerRouter.patch("/:id", validate(updateCustomerSchema), updateCustomer);

export default customerRouter;
