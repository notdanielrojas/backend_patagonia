import { Request, Response, NextFunction } from "express";

const validateCredentialsAtRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { name, last_name, email, password } = req.body;

  if (!name || !last_name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  next();
};

const validateCredentialsAtLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  next();
};

const validateCredentialsAtSubmit = (req: Request, res: Response, next: NextFunction): void => {
  const { image_url, title, description, user } = req.body;

  if (!image_url || !title || !description || !user?.id) {
    res.status(400).json({ message: "All fields are required, including user ID" });
    return;
  }

  next();
};

const validateCredentialsAtEdit = (req: Request, res: Response, next: NextFunction): void => {
  console.log("Request Body:", JSON.stringify(req.body, null, 2));

  const { image_url, title, description } = req.body;

  if (!image_url) {
    console.log("Missing image_url");
  }
  if (!title) {
    console.log("Missing title");
  }
  if (!description) {
    console.log("Missing description");
  }

  if (!image_url || !title || !description) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  next();
};

export {
  validateCredentialsAtRegister,
  validateCredentialsAtLogin,
  validateCredentialsAtSubmit,
  validateCredentialsAtEdit,
};
