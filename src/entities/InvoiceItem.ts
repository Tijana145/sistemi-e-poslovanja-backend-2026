import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Invoice } from "./Invoice";
import { TimeTable } from "./TimeTable";

@Index("fk_invoice_item_invoice_idx", ["invoiceId"], {})
@Index("fk_invoice_item_time_table_idx", ["timeTableId"], {})
@Entity("invoice_item", { schema: "psep_2026" })
export class InvoiceItem {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "invoice_item_id",
    unsigned: true,
  })
  invoiceItemId: number;

  @Column("int", { name: "invoice_id", unsigned: true })
  invoiceId: number;

  @Column("int", { name: "time_table_id", unsigned: true })
  timeTableId: number;

  @Column("int", { name: "price_per_item", unsigned: true })
  pricePerItem: number;

  @Column("int", { name: "count", unsigned: true })
  count: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "invoice_id", referencedColumnName: "invoiceId" }])
  invoice: Relation<Invoice>;

  @ManyToOne(() => TimeTable, (timeTable) => timeTable.invoiceItems, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "time_table_id", referencedColumnName: "timeTableId" }])
  timeTable: Relation<TimeTable> ;
}
