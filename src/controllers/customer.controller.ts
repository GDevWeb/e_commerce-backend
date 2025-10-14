import { Request, Response } from "express";
import { NotFoundError } from "../errors";
import { Customer } from "../generated/prisma";
import * as customerService from "../services/customer.service";
import { handlePrismaError } from "../utils/handlePrismaError";

export const getAllCustomers = async (
  req: Request,
  res: Response
): Promise<Customer[] | void> => {
  try {
    const customers = await customerService.getAllCustomers();

    if (customers.length === 0) {
      res.status(404).json({ message: "No customers found" });
      return;
    }
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const customerId = parseInt(req.params.id);

  const customer = await customerService.getCustomerById(customerId);

  if (!customer) {
    throw new NotFoundError(`Customer with ID ${customerId} not found`);
  }

  res.status(200).json({
    status: "success",
    data: customer,
  });
};

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<Customer | void> => {
  try {
    const newCustomer = await customerService.createCustomer(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }

    console.error("Error creating customer:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customerId = parseInt(req.params.id);

    const customer = await customerService.deleteCustomer(customerId);

    if (!customer) {
      res.status(404).json({
        message: `Customer with ID ${customerId} not found`,
      });
      return;
    }

    res.status(200).json({
      message: `Customer with ID ${customerId} deleted successfully`,
      customer,
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response
): Promise<Customer | void> => {
  try {
    const customerId = parseInt(req.params.id);

    const updatedCustomer = await customerService.updateCustomer(
      customerId,
      req.body
    );

    res.status(200).json(updatedCustomer);
  } catch (error) {
    if (handlePrismaError(error)) {
      return;
    }

    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
