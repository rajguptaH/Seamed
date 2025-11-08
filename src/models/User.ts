import { UserRole } from "@/types";
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.User,
  },
}, { timestamps: true });

export const User = models.User || model("User", UserSchema);
