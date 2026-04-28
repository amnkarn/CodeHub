import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if(!connectionString) {
    throw new Error("Database uri is missing");
}

const adapter = new PrismaPg({ connectionString });
const prismaClient = new PrismaClient({ adapter });

export default prismaClient;