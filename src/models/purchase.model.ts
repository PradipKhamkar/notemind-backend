import mongoose, { model, Schema } from "mongoose";
import { IPurchase } from "../types/user.type";

const purchaseSchema = new Schema<IPurchase>({
  // @ts-ignore
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true
  },
  autoRenewing: {
    type: Boolean,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  planType: {
    type: String,
    enum: ["weekly", "yearly"],
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true
    }
  },
  purchaseToken: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', "expired"]
  },
  packageName:{
    type:String,
    required:true
  }
},{timestamps:true});

  const PurchaseModel = model<IPurchase>("subscription",purchaseSchema);
  export default PurchaseModel