export interface IUser {
  _id: string;              // Primary Key
  name: string;
  email: string;
  loginProvider: string;
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}
