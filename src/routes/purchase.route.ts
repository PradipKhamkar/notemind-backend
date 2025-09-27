import express from "express";
import purchaseController from "../controller/purchase.controller";
const route = express.Router();

route.post('/', purchaseController.createPurchase);
route.get('/', purchaseController.verifyPurchase);

export default route