import axios from "axios";


const client = axios.create({
    baseURL: 'https://movie.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Name': 'PSEP_2026',

    },
    validateStatus: (status) => {
        return status === 200
    }
})

export class MovieService {
    static async getMoviesByIds(ids: number[]) {
        return await client.request({ 
      url: 'https://movie.pequla.com/api/movie/list',
      method: 'POST',
      data: ids

   })
}
    static async getMovieById(id: number) {
        return await client.request({
            url: `/movie/${id}`,
            method: 'GET'
        })
}
}