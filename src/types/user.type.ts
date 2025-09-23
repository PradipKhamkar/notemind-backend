export interface IUser {
  _id: string;              // Primary Key
  name: string;
  email: string;
  loginProvider: string;
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}

 export interface IPurchase{
    purchaseToken: string;
    startDate: string;
    expiryDate: string;
    autoRenewing: boolean;
    productId: string;
    orderId:string;
    status:"active"|"expired";
    planType:"weekly"|"yearly";
    price:{
      amount:number;
      currency:string;
    },
    packageName:string;
    createdBy:string;
    updatedAt:string;
    createdAt:string;
 }