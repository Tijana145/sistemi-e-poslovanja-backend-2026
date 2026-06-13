import { Router } from "express";
import { TimeTableService } from "../services/time.service";
import { defineRequest } from "../utils";

export const MovieRoute = Router()

MovieRoute.get('/', async (req, res) => {
    await defineRequest(res, async ()=>{
    return await TimeTableService.getAvailableMovies()
    })
})

MovieRoute.get('/:id', async (req, res) => {
    await defineRequest(res, async()=> {
      const id = Number(req.params.id)
      res.json( await TimeTableService.getMovieDetails(id))
   })
})