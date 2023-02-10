import  express  from "express";
import { getChat, login, register, UpdateUser, userstatus } from "../Controllers/userController.js";
import { protect } from "../Middlewares/authenMiddleware.js";


const user = express.Router()

user.post("/register",register)
user.post("/login",login)
user.post("/user-update",UpdateUser)
user.get("/user-chat",getChat)
user.get("/user-status",protect,userstatus)


export default user