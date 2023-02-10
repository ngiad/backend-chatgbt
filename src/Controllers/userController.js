import userModel from "../Models/userModel.js"
import jwt from "jsonwebtoken";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
  };

export const register = async(req,res,next) => {
    const { name, username, password} = req.body

    try {
        const userFind = await userModel.find({username})

        if(userFind.username) throw new Error("This account has already existed")

        if (!name || !username || !password) {
            throw new Error("Please fill in all required fields");
          }
      
        if(username.length < 6) throw new Error("Username must be up to 6 characters")
        if(password.length < 6) throw new Error("Password must be up to 6 characters")

        const userid = (await userModel.find()).length + 1

        const newUser = await userModel.create({ name, username, password, userid})
        
        const token = generateToken(newUser._id)

        res.status(200).json({token, listChat : newUser.listChat , username,name,userid})

    } catch (error) {
        next(error)
    }
}


export const login = async(req,res,next) => {
    const { username, password} = req.body

    try {

        if (!username || !password) {
            throw new Error("Please fill in all required fields");
        }
        if(username.length < 6) throw new Error("Username must be up to 6 characters")
        if(password.length < 6) throw new Error("Password must be up to 6 characters")

        const userFind = await userModel.findOne({username})

        if(!userFind._id) throw new Error("User not found")
        else{
            const {listChat , username,name ,userid} = userFind

            const token = generateToken(userFind._id)
            res.status(200).json({token, listChat , username,name,userid})

        }
    } catch (error) {
        next(error)
    }
}


export const UpdateUser = async (req,res,next) => {
    const { listChat,userid } = req.body

    try {
        const userFind = await userModel.findOne({userid})

        if(!userFind.username) throw new Error("User not found")

        Object.assign(userFind, {
            ...userFind,
            listChat: listChat,
          })

          userFind.save()

          res.status(201).json({complete : true})

    } catch (error) {
        next(error)
    }
}

export const getChat = async(req,res,next) => {

    const { userid,mesageId } = req.query
    try {
        const userFind = await userModel.findOne({userid})

        if(!userFind.username) throw new Error("User not found")

        console.log(JSON.stringify(userFind.listChat[0]._id) ===JSON.stringify(mesageId))

        const Chat = userFind.listChat.find((item) =>{
            return JSON.stringify(item._id) ===  JSON.stringify(mesageId)
        })

        res.status(201).json({Chat})
    } catch (error) {
        next(error)
    }
} 


export const userstatus = async(req,res,next) => {
    const {listChat , username,name ,userid ,_id} = req.User
    const token = generateToken(_id)
    res.status(200).json({token, listChat , username,name,userid})
}

