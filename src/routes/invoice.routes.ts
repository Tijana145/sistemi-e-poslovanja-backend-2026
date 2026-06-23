import { Router } from "express";
import { InvoiceService } from "../services/invoice.service";
import { defineRequest } from "../utils";

export const InvoiceRoute = Router()

InvoiceRoute.get('/cart', async (req:any, res) => {
    await defineRequest(res, async ()=>{
        const email = req.user.email
        return await InvoiceService.getCartItems(email)
    })
})
InvoiceRoute.put('/cart/add/:id', async (req:any, res) => {
    await defineRequest(res, async ()=>{
        const email = req.user.email
        const timeTableId = Number(req.params.id)
        return await InvoiceService.addItemToCart(timeTableId, email)
    })
})