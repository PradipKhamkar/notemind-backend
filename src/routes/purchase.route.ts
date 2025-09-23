import express from "express";
import purchaseController from "../controller/purchase.controller";
const route = express.Router();

route.post('/', purchaseController.createPurchase);

export default route