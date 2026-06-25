import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Cinema } from "../entities/Cinema";
import { MovieService } from "./movie.service";

const repo = AppDataSource.getRepository(Cinema)

export class CinemaService {
    static async getAll(){
        return  await repo.find({
            select: {
                cinemaId: true,
                name: true,
                address: true,
            },
            where:{
                deletedAt: IsNull(),
            }
        })
    }


    static async getAllWithTimeTables(){
        const data = await repo.find({
            select: {
                cinemaId: true,
                name: true,
                address: true,
                timeTables: {
                    timeTableId: true,
                    movieId: true,
                    price: true,
                    startTime: true
                }
            },
            where:{
                deletedAt: IsNull(),
                timeTables: {
                    deletedAt: IsNull()
                }
            },
            relations: {
                timeTables: true
            }
        })
        
        const ids: number[] = []
        for (let cinema of data){
            for (let timeTable of cinema.timeTables){
                ids.push(timeTable.movieId)
            }
        }
        const movies = await MovieService.getMoviesByIds(ids)
        for (let cinema of data){
            for (let timeTable of cinema.timeTables){
                timeTable.movie = movies.data.find(movie => movie.movieId == timeTable.movieId)
            }
        }

        return data
    }

    private static async getById(id: number){
        const data = await repo.findOneBy({
            cinemaId: id,
            deletedAt: IsNull()
        })
        if (data == null)
            throw new Error('NOT_FOUND')
        return data
    }

    static async getByIdSimple(id: number){
        const data = await repo.findOne({
            select: {
                cinemaId: true,
                name: true,
                address: true
            },
            where: {
                cinemaId: id,
                deletedAt: IsNull()
            }
        })
        if (data == null)
            throw new Error('NOT_FOUND')
        return data
    }

    static async create(obj: Cinema){
        const cinema = new Cinema()
        cinema.name = obj.name
        cinema.address = obj.address
        cinema.createdAt = new Date()
        await repo.save(cinema)
    }

    static async update(id: number, obj: Cinema){
        const cinema = await this.getById(id)
        cinema.name = obj.name
        cinema.address = obj.address
        cinema.updatedAt = new Date()
        await repo.save(cinema)
    }

    static async removeById(id: number){
        const cinema = await this.getById(id)
        cinema.deletedAt = new Date()
        await repo.save(cinema)
    }
}


