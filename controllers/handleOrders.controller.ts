import { Request, Response } from "express";
import {
  createOrder,
  addOrderDetails,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
} from "../models/orders.model";
import { handleErrors } from "../utils/codes.utils";

interface CustomError extends Error {
  code?: number;
}

const HandleCreateOrder = async (req: Request, res: Response): Promise<void> => {
  const { user_id, cart } = req.body;
  if (!user_id || !cart || cart.length === 0) {
    res.status(400).json({ message: "Invalid order request" });
    return;
  }

  try {
    const total = cart.reduce(
      (acc: number, item: { price: number; quantity: number }) => acc + item.price * item.quantity,
      0
    );

    const order_id = await createOrder({ user_id, total, status: "pending" });

    for (const item of cart) {
      await addOrderDetails({
        order_id,
        image_url: item.image_url,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      });
    }

    res.status(201).json({ message: "Order created successfully", order_id });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating order:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    res.status(500).json({ message: "Failed to create order" });
  }
};

const HandleGetOrdersByUserId = async (req: Request, res: Response): Promise<void> => {
  const user_id = parseInt(req.params.user_id);

  if (isNaN(user_id)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }

  try {
    const orders = await getOrdersByUserId(user_id);
    res.status(200).json(orders);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching orders:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const HandleUpdateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const orderId = parseInt(req.params.orderId);
  const { status } = req.body;

  if (isNaN(orderId) || !status) {
    res.status(400).json({ message: "Invalid order ID or status" });
    return;
  }

  try {
    await updateOrderStatus(orderId, status);
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error updating order status:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    res.status(500).json({ message: "Failed to update order status" });
  }
};

const HandleDeleteOrder = async (req: Request, res: Response): Promise<void> => {
  const orderId = parseInt(req.params.orderId);

  if (isNaN(orderId)) {
    res.status(400).json({ message: "Invalid order ID" });
    return;
  }

  try {
    await deleteOrder(orderId);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error deleting order:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    res.status(500).json({ message: "Failed to delete order" });
  }
};

const HandleAddOrderDetails = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  const details = req.body;
  try {
    await addOrderDetails({ order_id: parseInt(orderId), ...details });
    res.status(201).json({ message: "Order details added successfully" });
  } catch (error) {
    if (error instanceof Error) {
      const customError = error as CustomError;
      const errorResponse = handleErrors(customError.code || 500);
      res.status(errorResponse.status).send(errorResponse.message);
    } else {
      const errorResponse = handleErrors(500);
      res.status(errorResponse.status).send(errorResponse.message);
    }
  }
};

export {
  HandleCreateOrder,
  HandleGetOrdersByUserId,
  HandleUpdateOrderStatus,
  HandleDeleteOrder,
  HandleAddOrderDetails,
};
