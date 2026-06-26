import { AppDataSource } from "../db";
import { User } from "../entities/User";
import bcrypt from 'bcrypt'
import { MailSerivce } from "./mail.service";
import { generateVerificationCode } from "../utils";
import { Not, IsNull } from 'typeorm'
import * as jwt from 'jsonwebtoken'
import { isNullishCoalesce } from "typescript";
import { InvoiceItem } from "../entities/InvoiceItem";



const repo = AppDataSource.getRepository(User)
const JWT_SECRET = process.env.JWT_SECRET as string  

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
        const user = await this.getUserByEmail(obj.email)

        if(!bcrypt.compareSync(obj.password, user.password))
            throw new Error('USER_NOT_FOUND')

        
        return {
            access: jwt.sign({email: user.email}, JWT_SECRET, { expiresIn: '15s'}),
            refresh : jwt.sign({email: user.email}, JWT_SECRET, { expiresIn: '3d'}),
            email: user.email
        }

        
    }
    static async refreshToken(token: string){
        const decoded: any = jwt.verify(token, JWT_SECRET)
        const user =  await this.getUserByEmail(decoded.email)

        return {
            access: jwt.sign({email: user.email}, JWT_SECRET, { expiresIn: '15s'}),
            refresh: token,
            email: user.email
            
            
        }
    }
    static async validateToken(req: any, res: any, next: Function){
        const whitelisted = [
            '/api/user/login',
            '/api/user/refresh',
            '/api/user/signup',
            '/api/user/verify',
            
        ]
        if(whitelisted.find(w=>req.path.startsWith(w))){
            // putanja se nalazi u whitelisted
            // normalno se nastavlja execution same rute
            next()
            return
        }
        const auth = req.headers['authorization']
        const token = auth && auth.split(' ')[1]

        if (token == undefined){
            res.status(401).json({
                message: 'NO_TOKEN_FOUND',
                Timestamp: new Date()
            })
            return
        }
        jwt.verify(token, JWT_SECRET, (err: any, user: any)=>{
            if (err){
                res.status(403).json({
                message: 'INVALID_TOKEN',
                Timestamp: new Date()
            })
            return
            }
            req.user = user
            next()

        })
    }

    static async getUserByEmail(email: string){
        const user = await repo.findOneBy({
            email: email,
            verifiedAt: Not(IsNull()),
            deletedAt: IsNull()
        })

        if (user == null)
            throw new Error('USER_NOT_FOUND')

        return user

    }   
    static async getUserProfile(email: string){
        return await repo.findOneOrFail({
                select: {
                    userId: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    gender: true,
                    invoices: {
                        invoiceId: true,
                        pursId: true,
                        pursTime: true,
                        invoiceItems: {
                        invoiceItemId: true,
                        pricePerItem: true,
                        count: true
                        }
                    }
                },
                where: {
                    email,
                    deletedAt: IsNull(),
                  //  invoices: {
                  //      pursId: Not(IsNull()),
                  //      invoiceItems: {
                  //          deletedAt: IsNull()
                  //      }
               //     }

                },
                relations: {
                    invoices: {
                    invoiceItems: true
                    }
                }

                
            })
        }
        static async updateUserDetails(payload: any, email: string){
            const user = await this.getUserByEmail(email)

            if(payload.firstName == '' || payload.lastName == '')
                throw new Error('NAME_MUST_NOT_BE_EMPTY')

            if(payload.gender != 'm' || payload.gender != 'f')
                throw new Error('UNKNOWN_GENDER')

            user.firstName = payload.firstName
            user.lastName = payload.lastName
            user.gender = payload.gender
            await repo.save(user)

        }

        static async updateUserPassword(payload: any, email: string){
            const user = await this.getUserByEmail(email)

            if(payload.currentPassword == '' || payload.newPassword == '')
                throw new Error('PASSWORD_MUST_NOT_BE_EMPTY')

            if(!bcrypt.compareSync(payload.oldPassword, user.password))
                throw new Error('BAD_PASSWORD')

            user.password = bcrypt.hashSync(payload.newPassword, 12)
            await repo.save(user)
        }
    }


