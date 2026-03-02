import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { logger } from "../utils/logger";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Authentication required. Provide a Bearer token.",
    });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    logger.warn(`Invalid access token: ${(error as Error).message}`);
    res.status(401).json({
      success: false,
      error: "Invalid or expired access token.",
    });
  }
}
