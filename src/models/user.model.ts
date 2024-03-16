import mongoose from "mongoose";
import { UserIf } from "../@types/model.interce";

const UserSchema = new mongoose.Schema<UserIf>({
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    password: { type: String, required: true },
    amount: { type: Number, required: true, default: 100000 },
    win: { type: Number, required: true, default: 0 },
    loss: { type: Number, required: true, default: 0 },
    tie: { type: Number, required: true, default: 0 },
    flags: {
      isRejoin: { type: Boolean, required: true, default: false }
    },
    lastTableId: { type: String, default: "" }
  });
  
  // Create and export the model
  const UserModel = mongoose.model<UserIf>('User', UserSchema);
  export default UserModel;