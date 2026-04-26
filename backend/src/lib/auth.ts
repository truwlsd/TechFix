import jwt from "jsonwebtoken";

export interface AuthPayload {
  userId: string;
  isAdmin: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SIGN_OPTIONS: jwt.SignOptions = {
  expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
};

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, SIGN_OPTIONS);
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
