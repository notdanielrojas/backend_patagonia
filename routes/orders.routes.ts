import { Router, Request, Response } from "express";
import {
  HandleCreateOrder,
  HandleGetOrdersByUserId,
  HandleUpdateOrderStatus,
  HandleDeleteOrder,
} from "../controllers/handleOrders.controller.js";
import { addOrderDetails } from "../models/orders.model.js";
import { handleErrors } from "../utils/codes.utils.js";

const router = Router();

router.get("/:user_id", async (req: Request, res: Response): Promise<void> => {
  try {
    await HandleGetOrdersByUserId(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});


router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    await HandleCreateOrder(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.post("/:orderId/details", async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;
  const details = req.body;

  try {
    await addOrderDetails({ order_id: parseInt(orderId), ...details });
    res.status(201).json({ message: "Order details added successfully" });
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});


router.put("/:orderId/status", async (req: Request, res: Response): Promise<void> => {
  try {
    await HandleUpdateOrderStatus(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.delete("/:orderId", async (req: Request, res: Response): Promise<void> => {
  try {
    await HandleDeleteOrder(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

export default router;
