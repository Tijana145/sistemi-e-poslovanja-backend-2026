import { IsNull, Not } from "typeorm";
import { AppDataSource } from "../db";
import { Invoice } from "../entities/Invoice";
import { InvoiceItem } from "../entities/InvoiceItem";
import { TimeTable } from "../entities/TimeTable";
import { MovieService } from "./movie.service";
import { Cinema } from "../entities/Cinema";
import { UserService } from "./user.service";
import { randomUUIDv7 } from "bun";

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

        const items = await invoiceItemRepo.find({
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
        const arr = items.map(obj=> obj.timeTable.movieId)
        const unique = [...new Set(arr)]
        const movies = await MovieService.getMoviesByIds(unique)

        for(let item of items as any[]){ 
            item.timeTable.movie = movies.data.find((m:any) => m.movieId == item.timeTable.movieId) // dodali objekat filma o kome se zapravo radi
        }
        return items
    }

    private static async getUnpaidInvoice(email:string): Promise<Invoice>{
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
    static async removeCartItem(invoiceItemId: number, email: string){
        const unapidInvoice = await this.getUnpaidInvoice(email)
        const data = await invoiceItemRepo.findOneByOrFail({
            invoiceId: unapidInvoice.invoiceId,
            invoiceItemId,
            deletedAt: IsNull()

        })
        data.deletedAt = new Date()
        await invoiceItemRepo.save(data)
    }
    static async changeCartItemCount(invoiceItemId: number, email: string, newCount: number){
        if(newCount < 1)
            throw new Error('COUNT_MUST_BE >=1')

        const unapidInvoice = await this.getUnpaidInvoice(email)
        const data = await invoiceItemRepo.findOneByOrFail({
            invoiceId: unapidInvoice.invoiceId,
            invoiceItemId,
            deletedAt: IsNull()

        })
        data.count = newCount
        data.updatedAt = new Date()
        await invoiceItemRepo.save(data)

    }
    static async payInvoice(email: string){
        const unapidInvoice = await this.getUnpaidInvoice(email)

        const invoiceItems = await invoiceItemRepo.find({
            where:{
                invoiceId: unapidInvoice.invoiceId,
                deletedAt: IsNull()
            },
            relations: {
                timeTable: true
            }
        })
        if (invoiceItems.length == 0){
            throw new Error('CART_IS_EMPTY')
        }
        for(let item of invoiceItems){
            item.pricePerItem = item.timeTable.price
            await invoiceItemRepo.save(item)
        }


        unapidInvoice.pursId = randomUUIDv7()
        unapidInvoice.pursCounter = `${new Date().getFullYear()}/${Date.now()}`
        unapidInvoice.pursTime = new Date()

        await invoiceRepo.save(unapidInvoice)
    }
    static async getInvoices(email: string){
        const user = await UserService.getUserByEmail(email)
        return await invoiceRepo.find({
            select:{
                invoiceId: true,
                pursId: true,
                createdAt: true
            },
            where: {
                pursId: Not(IsNull()),
                userId: user.userId
            }
        })
    }
    
}