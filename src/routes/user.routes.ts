import { Router } from "express";
import { defineRequest } from "../utils";
import { UserService } from "../services/user.service";

export const UserRoute = Router()

UserRoute.get('/profile', async(req: any, res)=> {
    await defineRequest(res, async () =>{
        const email = req.user.email
        return await UserService.getUserProfile(email)
    })
})

UserRoute.post('/signup', async(require, res)=> {
    await defineRequest(res, async () =>{
        return await UserService.createAccount(require.body)
    })
})
UserRoute.put('/verify/:code', async(require, res)=> {
    await defineRequest(res, async () =>{
        const code = Number(require.params.code)
        return await UserService.verifyAccount(code)
    })
})
UserRoute.post('/login', async(require, res)=> {
    await defineRequest(res, async () =>{
        return await UserService.login(require.body)
    })
})
UserRoute.post('/refresh', async(require, res)=> {
    await defineRequest(res, async () =>{
        const auth = require.headers['authorization']
        const token = auth && auth.split(' ')[1]

        if(token == undefined)
            throw new Error("REFRESH_TOKEN_MISSING")

        return await UserService.refreshToken(token)
    })
})