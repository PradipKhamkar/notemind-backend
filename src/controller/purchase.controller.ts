import { Request, Response } from "express"
import { errorResponse, successResponse } from "../helper/response.helper"
import purchaseService from "../services/purchase.service"

const createPurchase = async(req:Request,res:Response)=>{
  try {
    // @ts-ignore
    const userId = request.userId
    console.log('PAYLOAD DATA FOR CREATE PURCHASE::',req.body)
    const purchaseRes = await purchaseService.createPurchase(userId,req.body.purchaseToken,req.body.orderId,req.body.productId,req.body.planType);
    successResponse(res,'purchase created successfully!',purchaseRes);
  } catch (error) {
    errorResponse(res)
  }
}


export default {createPurchase}