import { randomBytes, scryptSync } from "crypto";
import * as jwt from 'jsonwebtoken';
import { User } from "../schema";

export const generatePasswordHash = (password: string): string => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

export const verifyPassword = (
  inputPassword: string,
  storedHash: string
): boolean => {
  // Split the stored hash to get the salt and the original hash
  const [salt, originalHash] = storedHash.split(":");
  // Hash the input password using the same salt
  const inputHash = scryptSync(inputPassword, salt, 64).toString("hex");
  // Compare the newly generated hash with the original hash
  return inputHash === originalHash;
};

export const validateToken = (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as Pick<User, 'id' | 'username'>;
    return decoded;
  } catch (e) {
    throw new Error('Unauthorised');
  }
}
