import  jwt  from "jsonwebtoken"
import userModel from "../Models/userModel.js"

export const protect = async (req,res,next) =>{
    try {
        const token = req.headers.token

        if(!token) {
            res.status(400)
            throw new Error("Not authorized, please login")
        }

        const verified = jwt.verify(JSON.parse(token), process.env.JWT_SECRET)


        const User = await userModel.findById(verified.id)

        if(!User){
            res.status(400)
            throw new Error("User not found")
        }
        
        req.User = User
        req.token = token
        next()

    } catch (error) {
        res.status(400)
        next(error)
    }
}