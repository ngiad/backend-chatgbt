import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchma = new Schema(
  {
    name: {
      type: String,
      requireq: [true, "Please add your name"],
    },
    username: {
      type: String,
      requireq: [true, "Please add your username"],
      unique: true,
      trim: true,
      minlength: [6, " Username must be up to 6 characters"],
    },
    password: {
      type: String,
      requireq: [true, "Please add your password"],
      trim: true,
      minlength: [6, " Password must be up to 6 characters"],
    },
    userid: {
      type: String,
      required: [true, "not using your id"],
      unique: true,
      trim: true,
    },
    listChat: [
      { nameMesage: String, Chat: [{ name: String }, { mesage: String }] },
    ],
    decentralization: {
      type: String,
      default: "User",
    },
  },
  { timestamps: true }
);

userSchma.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

export default model("user", userSchma);
