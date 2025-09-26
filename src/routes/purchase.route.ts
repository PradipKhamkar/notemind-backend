import express from "express";
import purchaseController from "../controller/purchase.controller";
const route = express.Router();

route.post('/', purchaseController.createPurchase);
route.post('/verify', purchaseController.verifyPurchase);

export default route