import dotenv from "dotenv";
import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PrismaClient } from "./generated/prisma";
import brandRouter from "./routes/brand.routes";
import categoryRouter from "./routes/category.routes";
import customerRouter from "./routes/customer.routes";
import productRouter from "./routes/product.routes";

dotenv.config();

const server = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

server.use(express.json());

server.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

server.use("/api/product", productRouter);
server.use("/api/category", categoryRouter);
server.use("/api/brand", brandRouter);
server.use("/api/customer", customerRouter);

server.get("/", (req: Request, res: Response) => {
  res.status(200).send("Data Dashboard API is running");
});

async function main() {
  try {
    await prisma.$connect();
    console.log(`Successfully connected to the database`);

    server.listen(PORT, () => {
      console.log(`Server is listening on: "http://localhost:${PORT}"`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
}

main();
