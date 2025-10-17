import * as orderService from "../services/order.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: orders,
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = await orderService.getOrderById(orderId);

  res.status(200).json({
    status: "success",
    data: order,
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const newOrder = await orderService.createOrder(req.body);

  res.status(201).json({
    status: "success",
    message: "Order created successfully",
    data: newOrder,
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const orderId = parseInt(req.params.id);
  const updatedOrder = await orderService.updateOrder(orderId, req.body);

  res.status(200).json({
    status: "success",
    message: "Order updated successfully",
    data: updatedOrder,
  });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = parseInt(req.params.id);
  const deletedOrder = await orderService.deleteOrder(orderId);

  res.status(200).json({
    status: "success",
    message: "Order deleted successfully",
    data: deletedOrder,
  });
});
