import type { Request } from "express"

export interface RequestModel extends Request{
    user: {
        email: string
    }
}