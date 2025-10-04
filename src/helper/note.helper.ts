import config from "../config";
import { NoteModel } from "../models/note.model";
import { UserModel } from "../models/user.model";
import purchaseService from "../services/purchase.service";

const checkUserQuota = async (userId: string) => {
   try {
      const userInfo = await UserModel.findById(userId).select("freeQuotaExceed");
      if (!userInfo) throw new Error("user not found");
console.log('console.log(',userInfo.freeQuotaExceed)
      if (userInfo.freeQuotaExceed) {
         const purchase = await purchaseService.verifyPurchase(userId);
         if (purchase?.status !== "active") throw new Error("subscription_need")
      } else {
         const noteCount = await NoteModel.countDocuments({ createdBy: userId });
         if (noteCount >= config.FREE_NOTE_QUOTA) {
            userInfo.freeQuotaExceed = true;
            await userInfo.save();
            throw new Error("free_quota_exceed");
         }
      }
      return true
   } catch (error) {
      throw error
   }
}


export default { checkUserQuota }