import { Request, Response } from "express"
import { errorResponse, successResponse } from "../helper/response.helper"
import purchaseService from "../services/purchase.service"

const createPurchase = async(req:Request,res:Response)=>{
  try {
    // @ts-ignore
    const userId = req.userId
    console.log('PAYLOAD DATA FOR CREATE PURCHASE::',req.body)
    const purchaseRes = await purchaseService.createPurchase(userId,req.body.purchaseToken,req.body.orderId,req.body.productId,req.body.planType);
    successResponse(res,'purchase created successfully!',purchaseRes);
  } catch (error) {
    console.log('Failed Purchase',error)
    errorResponse(res)
  }
}

const verifyPurchase = async(req:Request,res:Response)=>{
  try {
    // @ts-ignore
    const userId = req.userId
    console.log('PAYLOAD DATA FOR VERIFY PURCHASE::',req.body)
    const purchaseRes = await purchaseService.verifyPurchase(userId);
    successResponse(res,'purchase verified successfully!',purchaseRes);
  } catch (error) {
    console.log('Failed Verify Purchase',error)
    errorResponse(res)
  }
}



export default {createPurchase,verifyPurchase}