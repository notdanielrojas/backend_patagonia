import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { verifyCredentials } from "../models/login.model";
import { handleErrors, handleSuccess } from "../utils/codes.utils";

const handleCredentialsAtLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await verifyCredentials(email, password);

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    const successResponse = handleSuccess(200);
    res.status(successResponse.status).json({
      message: successResponse.message,
      token,
      user: {
        email: user.email,
        id: user.id,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error during credentials verification:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    const errorResponse = handleErrors(401);
    res.status(errorResponse.status).json({ error: errorResponse.message });
  }
};

export { handleCredentialsAtLogin };
