import { Router } from "express";
import { defineRequest } from "../utils";
import { UserService } from "../services/user.service";

export const UserRoute = Router()

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