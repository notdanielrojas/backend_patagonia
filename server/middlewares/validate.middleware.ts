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
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  next();
};


export { validateCredentialsAtRegister, validateCredentialsAtLogin, validateCredentialsAtSubmit };
