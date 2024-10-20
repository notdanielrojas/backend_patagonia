import { Router, Request, Response } from "express";
import { handleCredentialsAtLogin } from "../controllers/handleLogin.controller.js";
import { validateCredentialsAtLogin } from "../middlewares/validate.middleware.js";
import { handleErrors } from "../utils/codes.utils.js";

const router = Router();

router.post("/", validateCredentialsAtLogin, async (req: Request, res: Response): Promise<void> => {
  try {
    await handleCredentialsAtLogin(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

export default router;
