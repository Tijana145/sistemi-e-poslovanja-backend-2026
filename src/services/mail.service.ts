import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
        }
    })

export class MailSerivce{
    static async send(to: string, title: string, body: string){
        await transporter.sendMail({
            from: `Praktikum 2026 <${process.env.GMAIL_USER}>`,
            to,
            subject: title,
            html: body
        })
    }
}