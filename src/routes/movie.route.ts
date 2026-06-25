import { Router } from "express";
import { defineRequest } from "../utils";
import { MovieService } from "../services/movie.service";

export const MovieRoute = Router()

MovieRoute.get('/', async (req, res) => {
    await defineRequest(res, async ()=>{
        const rsp = await MovieService.getMovies()
        return rsp.data.sort((a, b) => b.movieId - a.movieId)
    })
})

MovieRoute.get('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        const rsp = await MovieService.getMovieById(id)
        return rsp.data
    })
})
