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

customerRouter.get("/:customerId", getCustomer);

customerRouter.post("/", validate(createCustomerSchema), createCustomer);

customerRouter.delete("/:customerId", deleteCustomer);

customerRouter.put(
  "/:customerId",
  validate(updateCustomerSchema),
  updateCustomer
);

export default customerRouter;
