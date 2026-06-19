import { DataSource } from "typeorm";
import { Cinema } from "./entities/Cinema";
import { Invoice } from "./entities/Invoice";
import { InvoiceItem } from "./entities/InvoiceItem";
import { TimeTable } from "./entities/TimeTable";
import { User } from "./entities/User";
import { configDotenv } from "dotenv";

//configDotenv()
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Cinema, TimeTable, Invoice, InvoiceItem],
})