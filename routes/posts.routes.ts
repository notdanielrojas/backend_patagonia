import { Router, Request, Response } from "express";
import { handleErrors } from "../utils/codes.utils";
import {
  handleGetPostsByUserId,
  handlePostUser,
  handleEditPostUser,
  handleDeletePostUser,
  handleGetAllPosts,
} from "../controllers/handlePosts.controller";
import { validateCredentialsAtSubmit } from "../middlewares/validate.middleware";

const router = Router();

router.get("/all", async (req: Request, res: Response): Promise<void> => {
  try {
    await handleGetAllPosts(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await handleGetPostsByUserId(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.post("/", validateCredentialsAtSubmit, async (req: Request, res: Response): Promise<void> => {
  try {
    await handlePostUser(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.put("/:id", validateCredentialsAtSubmit, async (req: Request, res: Response): Promise<void> => {
  try {
    await handleEditPostUser(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    await handleDeletePostUser(req, res);
  } catch (error: any) {
    const errorResponse = handleErrors(error.code || 500);
    res.status(errorResponse.status).send(errorResponse.message);
  }
});

export default router;
