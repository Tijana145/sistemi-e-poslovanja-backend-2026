import { DataSource } from "typeorm";
import { Cinema } from "./entities/Cinema";
import { Invoice } from "./entities/Invoice";
import { InvoiceItem } from "./entities/InvoiceItem";
import { TimeTable } from "./entities/TimeTable";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'psep_2026',
  entities: [User, Cinema, TimeTable, Invoice, InvoiceItem],
})