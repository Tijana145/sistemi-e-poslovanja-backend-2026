import { Router } from "express";
import { InvoiceService } from "../services/invoice.service";
import { defineRequest } from "../utils";

export const InvoiceRoute = Router()

InvoiceRoute.get('/', async (req:any, res) => {
    await defineRequest(res, async ()=>{
        const email = req.user.email
        return await InvoiceService.getCartItems(email)
    })
})

InvoiceRoute.get('/cart', async (req:any, res) => {
    await defineRequest(res, async ()=>{
        const email = req.user.email
        return await InvoiceService.getCartItems(email)
    })
})
//InvoiceRoute.get('/my', async (req:any, res) => {
//    await defineRequest(res, async ()=>{
//        const email = req.user.email
 //       return await InvoiceService.getInvoices(email)
 //   })
//})
InvoiceRoute.put('/cart/add/:id', async (req:any, res) => {
    await defineRequest(res, async ()=>{
        const email = req.user.email
        const timeTableId = Number(req.params.id)
        return await InvoiceService.addItemToCart(timeTableId, email)
    })
})
InvoiceRoute.put('/cart/:id/count/:count', async (req:any, res) => {
    await defineRequest(res, async ()=>{
        const email = req.user.email
        const invoiceItemId = Number(req.params.id)
        const count= Number(req.params.count)
        return await InvoiceService.changeCartItemCount(invoiceItemId, email, count)
    })
})
InvoiceRoute.put('/pay', async (req:any, res) => {
    await defineRequest(res, async ()=>{
        const email = req.user.email
        return await InvoiceService.payInvoice(email)
    })
})
InvoiceRoute.delete('/cart/:id', async (req:any, res) => {
    await defineRequest(res, async ()=>{
        const email = req.user.email
        const invoiceItemId = Number(req.params.id)
        //const count= Number(req.params.count)
        return await InvoiceService.removeCartItem(invoiceItemId, email)
    })
})