import config from "../config";
import { google } from "googleapis";
import PurchaseModel from "../models/purchase.model";
const androidpublisher = google.androidpublisher("v3");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(config.GOOGLE.SERVICE_ACCOUNT as string),
  scopes: ["https://www.googleapis.com/auth/androidpublisher"],
});

const verifyPurchase = async (
  packageName: string,
  subscriptionId: string,
  purchaseToken: string
) => {
  try {
    await auth.getClient();
    const result = await androidpublisher.purchases.subscriptions.get({
      auth: auth,
      packageName: packageName,
      subscriptionId: subscriptionId,
      token: purchaseToken,
    });
    return result.data;
  } catch (error) {
    console.log("Error Inside Verify Purchase", error);
    throw error;
  }
};

const createPurchase = async (
  userId: string,
  purchaseToken: string,
  orderId: string,
  productId: string,
  planType: "weekly" | "yearly"
) => {
  try {
    const verifiedInfo = await verifyPurchase(config.APPLICATION_PACKAGE_NAME as string,orderId,purchaseToken);
    if (!verifiedInfo) throw new Error("failed to verify purchase!");

    const userPurchase = await PurchaseModel.findOne({
      createdBy: userId,
      status: "active",
    });
    if (userPurchase) {
      userPurchase.status = "expired";
      await userPurchase.save();
    }
    const {
      autoRenewing,
      expiryTimeMillis,
      startTimeMillis,
      priceAmountMicros,
      priceCurrencyCode,
    } = verifiedInfo;
    const newPurchase = await PurchaseModel.create({
      orderId,
      purchaseToken,
      productId,
      planType,
      autoRenewing,
      expiryDate: expiryTimeMillis,
      startDate: startTimeMillis,
      price: {
        amount: parseInt(priceAmountMicros as string) / 1000000,
        currency: priceCurrencyCode,
      },
      createdBy: userId,
      status: "active",
    });
    return newPurchase;
  } catch (error) {
    console.log('Error In Purchase::',JSON.stringify(error))
    throw error;
  }
};

export default { verifyPurchase, createPurchase };
