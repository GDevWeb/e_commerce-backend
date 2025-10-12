import { Request, Response } from "express";
import { Customer, Prisma } from "../generated/prisma";
import * as customerService from "../services/customer.service";
import { validateId } from "../utils/validation.utils";

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
): Promise<Customer | void> => {
  try {
    const customerId = parseInt(req.params.customerId);

    if (!validateId(customerId, res, "Customer")) {
      return;
    }

    const customer = await customerService.getCustomerById(customerId);

    if (!customer) {
      res
        .status(404)
        .json({ message: `Customer with ID ${customerId} not found` });
      return;
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCustomer = async (
  req: Request,
  res: Response
): Promise<Partial<Customer> | void> => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      date_of_birth,
      last_purchase_date,
      total_orders,
      total_spent,
      customer_type,
      preferred_contact_method,
    } = req.body;

    // Validations obligatoires
    if (!first_name || !last_name || !email || !phone_number || !address) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (typeof first_name !== "string" || first_name.trim() === "") {
      res
        .status(400)
        .json({ message: "First name must be a non-empty string" });
      return;
    }

    if (typeof last_name !== "string" || last_name.trim() === "") {
      res.status(400).json({ message: "Last name must be a non-empty string" });
      return;
    }

    if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (typeof phone_number !== "string" || phone_number.trim() === "") {
      res
        .status(400)
        .json({ message: "Phone number must be a non-empty string" });
      return;
    }

    if (typeof address !== "string" || address.trim() === "") {
      res.status(400).json({ message: "Address must be a non-empty string" });
      return;
    }

    let dateOfBirth: Date | undefined;
    if (date_of_birth) {
      dateOfBirth = new Date(date_of_birth);
      if (isNaN(dateOfBirth.getTime())) {
        res.status(400).json({
          message:
            "Invalid date_of_birth format. Use ISO-8601 format (e.g., 2015-10-19T00:00:00.000Z)",
        });
        return;
      }
    }

    let lastPurchaseDate: Date | undefined;
    if (last_purchase_date) {
      lastPurchaseDate = new Date(last_purchase_date);
      if (isNaN(lastPurchaseDate.getTime())) {
        res.status(400).json({
          message: "Invalid last_purchase_date format. Use ISO-8601 format",
        });
        return;
      }
    }

    const customerData: Prisma.CustomerCreateInput = {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      // Optional fields
      ...(dateOfBirth && { date_of_birth: dateOfBirth }),
      ...(lastPurchaseDate && { last_purchase_date: lastPurchaseDate }),
      ...(total_orders !== undefined && { total_orders }),
      ...(total_spent !== undefined && { total_spent }),
      ...(customer_type && { customer_type }),
      ...(preferred_contact_method && { preferred_contact_method }),
    };

    const newCustomer = await customerService.createCustomer(customerData);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const customerId = parseInt(req.params.customerId);

    if (!validateId(customerId, res, "Customer")) {
      return;
    }

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
): Promise<Partial<Customer> | void> => {
  try {
    const customerId = parseInt(req.params.customerId);

    if (!validateId(customerId, res, "Customer")) {
      return;
    }

    const existingCustomer = await customerService.getCustomerById(customerId);

    if (!existingCustomer) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const { first_name, last_name, email, phone_number, address } = req.body;

    if (!first_name && !last_name && !email && !phone_number && !address) {
      res.status(400).json({ message: "No update data provided" });
      return;
    }

    if (
      first_name !== undefined &&
      (typeof first_name !== "string" || first_name.trim() === "")
    ) {
      res
        .status(400)
        .json({ message: "First name must be a non-empty string" });
      return;
    }
    if (
      last_name !== undefined &&
      (typeof last_name !== "string" || last_name.trim() === "")
    ) {
      res.status(400).json({ message: "Last name must be a non-empty string" });
      return;
    }
    if (
      email !== undefined &&
      (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email))
    ) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }
    if (
      phone_number !== undefined &&
      (typeof phone_number !== "string" || phone_number.trim() === "")
    ) {
      res
        .status(400)
        .json({ message: "Phone number must be a non-empty string" });
      return;
    }
    if (
      address !== undefined &&
      (typeof address !== "string" || address.trim() === "")
    ) {
      res.status(400).json({ message: "Address must be a non-empty string" });
      return;
    }

    const data = {
      first_name:
        first_name !== undefined ? first_name : existingCustomer.first_name,
      last_name:
        last_name !== undefined ? last_name : existingCustomer.last_name,
      email: email !== undefined ? email : existingCustomer.email,
      phone_number:
        phone_number !== undefined
          ? phone_number
          : existingCustomer.phone_number,
      address: address !== undefined ? address : existingCustomer.address,
      date_of_birth: existingCustomer.date_of_birth,
      last_purchase_date: existingCustomer.last_purchase_date,
      total_orders: existingCustomer.total_orders,
      total_spent: existingCustomer.total_spent,
      customer_type: existingCustomer.customer_type,
      preferred_contact_method: existingCustomer.preferred_contact_method,
    };

    const updatedCustomer = await customerService.updateCustomer(
      customerId,
      data
    );
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
