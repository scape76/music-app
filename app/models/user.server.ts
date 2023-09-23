import { db } from "~/lib/db";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email: string) {
  return await db.user.findFirst({
    where: {
      email,
    },
  });
}

export async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
}

export async function verifyLogin({
  email,
  password,
}: {
  email: User["email"];
  password: User["password"];
}) {
  if (!password) return null;

  const userWithPassword = await db.user.findUnique({ where: { email } });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) return null;

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
