import { User, Role } from "../../generated/prisma";
import { faker } from "@faker-js/faker";
import * as argon from "argon2";


export const generateUserSeed = (): Omit<User, "id" | "createdAt" | "updatedAt"> => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: "", // will be hashed later
    role: faker.helpers.arrayElement([Role.GUEST, Role.OWNER, Role.ADMIN]),
  };
};

export const createAdminUser = async (): Promise<Omit<User, "id" | "createdAt" | "updatedAt">> => {
  const password = await argon.hash("Admin@123!");
  return {
    name: "Super Admin",
    email: "admin@hotel.com",
    password,
    role: Role.ADMIN,
  };
};

export const createOwnerUser = async (name: string, email: string): Promise<Omit<User, "id" | "createdAt" | "updatedAt">> => {
  const password = await argon.hash("Owner@123!");
  return {
    name,
    email: email.toLowerCase(),
    password,
    role: Role.OWNER,
  };
};