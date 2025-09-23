import { Request, Response } from "express"
import { errorResponse, successResponse } from "../helper/response.helper"
import purchaseService from "../services/purchase.service"

const createPurchase = async(req:Request,res:Response)=>{
  try {
        // @ts-ignore
    const userId = request.userId
    const purchaseRes = await purchaseService.createPurchase(userId,req.body.packageName,req.body.purchaseToken,req.body.orderId,req.body.productId,req.body.planType);
    successResponse(res,'purchase verified successfully!',purchaseRes);
  } catch (error) {
    errorResponse(res)
  }
}


export default {createPurchase}