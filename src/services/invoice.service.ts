import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Invoice } from "../entities/Invoice";
import { InvoiceItem } from "../entities/InvoiceItem";
import { TimeTable } from "../entities/TimeTable";
import { MovieService } from "./movie.service";
import { Cinema } from "../entities/Cinema";
import { UserService } from "./user.service";

const invoiceRepo = AppDataSource.getRepository(Invoice)
const invoiceItemRepo = AppDataSource.getRepository(InvoiceItem)
const timeTableRepo = AppDataSource.getRepository(TimeTable)

export class InvoiceService {
    static async addItemToCart(timeTableId: number, email: string){
        const timeTable = await timeTableRepo.findOneByOrFail({
            timeTableId,
            deletedAt: IsNull()
        })
        const unpaidInvoice = await this.getUnpaidInvoice(email)

        const existing = await invoiceItemRepo.findOneBy({
            invoiceId: unpaidInvoice.invoiceId,
            timeTableId: timeTable.timeTableId,
            deletedAt: IsNull()
        })

        if (existing == null){
        await invoiceItemRepo.save({
            invoiceId: unpaidInvoice.invoiceId,
            timeTableId: timeTable.timeTableId,
            pricePerItem: timeTable.price,
            count: 1, 
            createdAt: new Date()

        })
        return
    }

    existing.count = existing.count + 1
    existing.updatedAt = new Date()
    await invoiceItemRepo.save(existing)
    }

    static async getCartItems(email: string){
        const unapidInvoice = await this.getUnpaidInvoice(email)

        return await invoiceItemRepo.find({
            select: {
                invoiceItemId: true,
                count: true,
                timeTable: {
                    timeTableId: true,
                    movieId: true,
                    price: true,
                    startTime: true,
                    cinema: {
                        cinemaId: true,
                        name: true
                    }
                }
            },
            where: {
                invoiceId: unapidInvoice.invoiceId,
                deletedAt: IsNull(),
                timeTable: {
                    deletedAt : IsNull(),
                    cinema : {
                        deletedAt: IsNull()
                    }
                }
            },
            relations: {
                timeTable: {
                    cinema: true

                }
            }
        })
    }

    private static async getUnpaidInvoice(email:string){
        const user = await UserService.getUserByEmail(email)
        let unpaidInvoice = await invoiceRepo.findOneBy({
                userId: user.userId,
                pursId: IsNull()
        })
        if (unpaidInvoice == null){
            unpaidInvoice = await invoiceRepo.save({
                userId: user.userId,
                pursId: null,
                pursTime: null,
                pursCounter: null,
                createdAt: new Date()
            })
        }
        return unpaidInvoice
    }
}