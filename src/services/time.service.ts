import { IsNull } from "typeorm"
import { AppDataSource } from "../db"
import { TimeTable } from "../entities/TimeTable"

const repo = AppDataSource.getRepository(TimeTable)

export class TimeTableService {

    static async getTimeTableById(id: number){
        const data = await repo.findOne({
        select: {
            timeTableId: true,
            movieId: true,
            cinemaId: true,
            startTime: true,
            price: true,
        },
        where: {
            timeTableId: id,
            deletedAt: IsNull(),
            cinema: {
                deletedAt: IsNull()
            }
        }
        })
        if (data == null)
            throw new Error('NOT_FOUND')

        return data

    }
    static async update(id: number, obj: TimeTable){
        const data = await repo.findOneOrFail({
            where: {
            timeTableId: id,
            deletedAt: IsNull(),
            cinema: {
                deletedAt: IsNull()
            }
            }
        })
        data.movieId = obj.movieId
        data.cinemaId = obj.cinemaId
        data.startTime = obj.startTime
        data.price = obj.price
        data.updatedAt = new Date()

        await repo.save(data)
    }
    static async create(obj: TimeTable){
        const data = new TimeTable()

        data.movieId = obj.movieId
        data.cinemaId = obj.cinemaId
        data.startTime = obj.startTime
        data.price = obj.price
        data.createdAt = new Date()

        await repo.save(data)
    }
    static async deleteById(id:number){
         const data = await repo.findOneOrFail({
            where: {
            timeTableId: id,
            deletedAt: IsNull(),
            cinema: {
                deletedAt: IsNull()
            }
            }
        })
        data.deletedAt = new Date()
        await repo.save(data)

    }
}
