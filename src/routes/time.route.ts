import { Router } from "express";
import { defineRequest } from "../utils";
import { TimeTableService } from "../services/time.service";

export const TimeTableRoute = Router()

TimeTableRoute.get('/:id', async (req, res) => {
    await defineRequest(res, async()=> {
      const id = Number(req.params.id)
      res.json( await TimeTableService.getTimeTableById(id))
   })
})
TimeTableRoute.post('/', async (req, res) => {
    await defineRequest(res, async()=> {
      const id = Number(req.params.id)
      res.json( await TimeTableService.create(req.body))
   })
})
TimeTableRoute.put('/:id', async (req, res) => {
    await defineRequest(res, async()=> {
      const id = Number(req.params.id)
      res.json( await TimeTableService.update(id, req.body))
   })
})
TimeTableRoute.delete('/:id', async (req, res) => {
    await defineRequest(res, async()=> {
      const id = Number(req.params.id)
      res.json( await TimeTableService.deleteById(id))
   })
})