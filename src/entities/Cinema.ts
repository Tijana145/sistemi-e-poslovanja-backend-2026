import { Column, Entity, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { TimeTable } from "./TimeTable";

@Entity("cinema", { schema: "psep_2026" })
export class Cinema {
  @PrimaryGeneratedColumn({ type: "int", name: "cinema_id", unsigned: true })
  cinemaId: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "address", length: 255 })
  address: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => TimeTable, (timeTable) => timeTable.cinema)
  timeTables: TimeTable[];
}
