import config from "../config";
import { google } from "googleapis";
import PurchaseModel from "../models/purchase.model";
const androidpublisher = google.androidpublisher("v3");
const packageName = "com.pradip.notebookai";

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(config.GOOGLE.SERVICE_ACCOUNT as string),
  scopes: ["https://www.googleapis.com/auth/androidpublisher"],
});

const verifyPurchaseWithGoogle = async (
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
    const verifiedInfo = await verifyPurchaseWithGoogle(
      productId,
      purchaseToken
    );

    if (!verifiedInfo || !verifiedInfo.expiryTimeMillis) throw new Error("failed to verify purchase!");
    const { autoRenewing, expiryTimeMillis, startTimeMillis, priceAmountMicros, priceCurrencyCode, } = verifiedInfo;
    if (parseInt(expiryTimeMillis) <= Date.now()) throw new Error('Purchase Token Expired!');

    const userPurchase = await PurchaseModel.findOne({ createdBy: userId, status: "active" });
    if (userPurchase) {
      userPurchase.status = "expired";
      await userPurchase.save();
    }
    const newPurchase = await PurchaseModel.create({
      orderId,
      packageName,
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
    console.log("Error Create In Purchase::", JSON.stringify(error));
    throw error;
  }
};

const verifyPurchase = async (userId: string) => {
  try {
    const lastPurchase = await PurchaseModel.findOne({ createdBy: userId }).sort({ createdAt: -1 }).select('-packageName');
    if (!lastPurchase) return null

    // verify with google
    const isValidToken = await verifyPurchaseWithGoogle(lastPurchase.productId, lastPurchase.purchaseToken);
    if (!isValidToken || !isValidToken.expiryTimeMillis) throw new Error("failed to verify purchase!");

    if (parseInt(isValidToken.expiryTimeMillis) <= Date.now()) lastPurchase.status = "expired";
    else {
      lastPurchase.expiryDate = isValidToken.expiryTimeMillis;
      lastPurchase.status = "active";
    }
    await lastPurchase.save();
    return lastPurchase
  } catch (error) {
    console.log('Error In Verify Purchase', JSON.stringify(error))
    throw error
  }
}

export default { verifyPurchase, createPurchase };
