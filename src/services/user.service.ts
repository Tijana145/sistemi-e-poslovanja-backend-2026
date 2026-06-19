import { AppDataSource } from "../db";
import { User } from "../entities/User";
import bcrypt from 'bcrypt'

const repo = AppDataSource.getRepository(User)

export class UserService{
    static async createAccount(obj: any){
        if (await repo.existsBy({email: obj.email}))
            throw Error('USER_EXISTS')

        const hashed = await bcrypt.hashSync(obj.password, 12)
        const code = new Date().getMilliseconds()

        await repo.save({
            firstName: obj.firstName,
            lastName: obj.lastName,
            gender: obj.gender,
            email: obj.email,
            password: hashed,
            emailCode : code,
            createdAt: new Date()
     })
    }
}