import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { AppError } from "../middleware/errorHandler";
import { generateTokenPair, TokenPayload } from "../utils/jwt";
import { logger } from "../utils/logger";
import { SignupInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 12;

export async function signupUser(data: SignupInput): Promise<{
  user: { id: string; name: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
}> {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
    },
  });

  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokenPair(payload);

  logger.info(`User signed up: ${user.email}`);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{
  user: { id: string; name: string; email: string; role: string };
  accessToken: string;
  refreshToken: string;
}> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const tokens = generateTokenPair(payload);

  logger.info(`User logged in: ${user.email}`);

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  };
}

export async function refreshTokens(payload: TokenPayload): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  const newPayload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  return generateTokenPair(newPayload);
}

export async function getCurrentUser(
  userId: string
): Promise<{
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
