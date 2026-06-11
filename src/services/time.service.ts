import { IsNull } from "typeorm"
import { AppDataSource } from "../db"
import { TimeTable } from "../entities/TimeTable"
import { MovieService } from "./movie,service"

const repo = AppDataSource.getRepository(TimeTable)

export class TimeTableService {
    static async getAvailableMovies() {
           const data = await repo.find({
    select: {
        timeTableId: true,
        movieId: true,
    },
    where:{
      deletedAt: IsNull(),
      cinema : {
        deletedAt: IsNull()
      }
    }
   })

   const arr = data.map(obj=> obj.movieId)
   const unique = [...new Set(arr)]
   const movies = await MovieService.getMoviesByIds(unique)
   return movies.data
    }
    static async getMovieDetails(id: number) {
    const rsp = await MovieService.getMovieById(id)

    if (rsp.status != 200) {
        throw new Error('Movie not found')
    }

    const data = await repo.find({
        select: {
            timeTableId: true,
            cinemaId: true,
            cinema: {
                cinemaId: true,
                name: true,
            },
            startTime: true,
            price: true,
        },
        where: {
            movieId: id,
            deletedAt: IsNull(),
            cinema: {
                deletedAt: IsNull()
            }
        },
        relations: {
            cinema: true,
        }
    })

  return {
    ...rsp.data,
    timeTables: data
}
}
}
