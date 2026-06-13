import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { AppDataSource } from './db';
import { MovieRoute } from './routes/movie.route';
import { CinemaRoute } from './routes/cinema.routes';

const app = express()
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

app.use('/api/movie', MovieRoute)
app.use('/api/cinema', CinemaRoute)



AppDataSource.initialize().then(() => {
   console.log('Connected to the database')
   app.listen(3300, () => {
      console.log('Application started')
   })
})