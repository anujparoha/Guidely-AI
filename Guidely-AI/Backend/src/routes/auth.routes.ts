import { Router } from "express";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rateLimiter";
import { signupSchema, loginSchema } from "../schemas/auth.schema";
import {
  signupHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", authRateLimiter, validate(signupSchema), signupHandler);
router.post("/login", authRateLimiter, validate(loginSchema), loginHandler);
router.post("/refresh", authRateLimiter, refreshHandler);
router.post("/logout", logoutHandler);
router.get("/me", authenticate, meHandler);

export default router;
