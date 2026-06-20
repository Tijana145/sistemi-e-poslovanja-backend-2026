import { AppDataSource } from "../db";
import { User } from "../entities/User";
import bcrypt from 'bcrypt'
import { MailSerivce } from "./mail.service";
import { generateVerificationCode } from "../utils";
import { Not, IsNull } from 'typeorm'
import jwt from 'jsonwebtoken' 


const repo = AppDataSource.getRepository(User)
const JWT_SECRET = process.env.JWT_SECRET ?? ''

export class UserService{
    static async createAccount(obj: any){
        if (await repo.existsBy({email: obj.email}))
            throw Error('USER_EXISTS')

        const hashed = await bcrypt.hashSync(obj.password, 12)
        const code = generateVerificationCode()

        MailSerivce.send(obj.email, 'Email verification code', `
             <h3>Hi ${obj.fistName}, Welcome to our app!</h3>
             <p> Your verification code is: <strong>${code}</strong?<p>
            `)

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
    static async verifyAccount(code: number){
        const acc = await repo.findOneBy({
            emailCode: code,
            deletedAt: IsNull(),
            verifiedAt: IsNull()
        })
        if (acc == null)
            throw new Error('NOT_FOUND')

        acc.verifiedAt = new Date()
        await repo.save(acc)
    }
    static async login(obj: any){
        const user = await repo.findOneBy({
            email: obj.email,
            verifiedAt: Not(IsNull()),
            deletedAt: IsNull()
        })
        if (user == null)
            throw new Error('USER_NOT_FOUND')

        if(!bcrypt.compareSync(obj.password, user.password))
            throw new Error('USER_NOT_FOUND')

        
        return {
            access: jwt.sign({email: user.email}, JWT_SECRET, { expiresIn: '15s'}),
            refresh : jwt.sign({email: user.email}, JWT_SECRET, { expiresIn: '3d'}),
            email: user.email
        }

        
    }
}