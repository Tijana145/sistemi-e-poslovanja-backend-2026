import { Router } from "express";
import { CinemaService } from "../services/cinema.service";
import { defineRequest } from "../utils";

export const CinemaRoute = Router()

CinemaRoute.get('/', async (req, res) => {
   await defineRequest(res, async () => {
      return await CinemaService.getAll()
   })
})

CinemaRoute.get('/:id', async (req, res) => {
   await defineRequest(res, async () => {
      const id = Number(req.params.id)
      return await CinemaService.getByIdSimple(id)
   })
})

CinemaRoute.post('/', async(req, res)=>{
   await defineRequest(res, async () => {
      await CinemaService.create(req.body)
   })
})

CinemaRoute.put('/:id', async(req, res)=>{
   await defineRequest(res, async () => {
      const id = Number(req.params.id)
      await CinemaService.update(id, req.body)
   })
})
CinemaRoute.put('/:id', async(req, res)=>{
   await defineRequest(res, async () => {
      const id = Number(req.params.id)
      await CinemaService.removeById(req.body)
   })
})
CinemaRoute.delete('/:id', async (req, res) => {
   await defineRequest(res, async () => {
      const id = Number(req.params.id)
      return await CinemaService.removeById(id)
   })
})