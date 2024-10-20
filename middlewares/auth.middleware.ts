import { Request, Response, NextFunction } from "express";
import { verifyDecodeToken } from "../utils/token.utils";

interface CustomRequest extends Request {
  user?: { id: number; email: string };
}

interface CustomError extends Error {
  code?: number;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ error: "Authorization header is missing" });
    return;
  }

  try {
    const { id, email } = verifyDecodeToken(authorizationHeader);
    req.user = { id, email };
    next();
  } catch (error) {
    const customError = error as CustomError;
    console.log("Middleware error:", customError);
    res.status(customError.code || 401).json({ error: customError.message || "Invalid token" });
    return;
  }
};

export { authMiddleware };
