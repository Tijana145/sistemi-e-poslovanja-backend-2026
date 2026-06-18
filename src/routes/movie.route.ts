import { Router } from "express";
import { TimeTableService } from "../services/time.service";
import { defineRequest } from "../utils";
import { MovieService } from "../services/movie.service";

export const MovieRoute = Router()

MovieRoute.get('/', async (req, res) => {
    await defineRequest(res, async ()=>{
    return await TimeTableService.getAvailableMovies()
    })
})

MovieRoute.get('/all', async (req, res) => {
    await defineRequest(res, async ()=>{
        const rsp = await MovieService.getMovies()
        return rsp.data
    })
})

MovieRoute.get('/:id', async (req, res) => {
    await defineRequest(res, async()=> {
      const id = Number(req.params.id)
      res.json( await TimeTableService.getMovieDetails(id))
   })
})