import { Router, Request, Response } from "express";
import { handleErrors } from "../utils/codes.utils";
import {
  handleRegisterUser,
  handleGetUser,
  handleEditUser,
  handleDeleteUser,
  handleGetAllUsers,
} from "../controllers/handleUser.controller";
import { validateCredentialsAtRegister } from "../middlewares/validate.middleware";

const router = Router();

router.post("/", validateCredentialsAtRegister, async (req: Request, res: Response): Promise<void> => {
  try {
    await handleRegisterUser(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    await handleGetUser(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.get("/all", async (req: Request, res: Response): Promise<void> => {
  try {
    await handleGetAllUsers(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await handleEditUser(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await handleDeleteUser(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

export default router;
