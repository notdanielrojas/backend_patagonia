import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const logFilePath = path.join(__dirname, "../logs/access.log");

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logEntry = `${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ${
      res.statusCode
    } | ${duration}ms\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error("Error writing to the log file:", err);
      }
    });
  });

  next();
};

export { logger };
