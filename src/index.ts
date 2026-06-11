import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { AppDataSource } from './db';
import { TimeTableService } from './services/time.service';


const app = express()
app.use(cors())
app.use(morgan('combined'))


app.get('/api/movie', async (req, res) => {
   res.json(await TimeTableService.getAvailableMovies())
 })

 app.get('/api/movie/:id', async (req, res) => {
  const id = Number(req.params.id)
   res.json(await TimeTableService.getMovieDetails(id))
 })

AppDataSource.initialize().then(() => { 
            console.log('Connected to the database')
            app.listen(3300, () => {
                console.log('Application started')
            })

          })