import { Request, Response, NextFunction } from "express";
import {
  signupUser,
  loginUser,
  refreshTokens,
  getCurrentUser,
} from "../services/auth.service";
import { verifyRefreshToken } from "../utils/jwt";
import { env } from "../config/env";

const REFRESH_COOKIE_NAME = "refreshToken";

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/auth",
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/api/auth",
  });
}

export async function signupHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { user, accessToken, refreshToken } = await signupUser(req.body);

    setRefreshCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      data: { user, accessToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function refreshHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Refresh token not provided.",
      });
      return;
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      clearRefreshCookie(res);
      res.status(401).json({
        success: false,
        error: "Invalid or expired refresh token.",
      });
      return;
    }

    const tokens = await refreshTokens({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutHandler(
  _req: Request,
  res: Response
): Promise<void> {
  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    data: { message: "Logged out successfully." },
  });
}

export async function meHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
      return;
    }

    const user = await getCurrentUser(req.user.id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
}
