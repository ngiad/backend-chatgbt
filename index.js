import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./src/Middlewares/errorHandler.js";
import user from "./src/Routers/userRouter.js";
import { Configuration, OpenAIApi } from "openai";
import adminModel from "./src/Models/adminModel.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;


app.get("/", (req, res) => {
  res.send('SERVER ON')
})
app.use("/api/user/", user)


app.post("/admin",async(req,res,next) => {
    const { api } = req.body
    try {
        const apinew = await adminModel.create({API_CHATGBT : api})

        res.json({API_CHATGBT : apinew.API_CHATGBT})
    } catch (error) {
        next(error)
    }
})

app.post("/chat", async (req, res,next) => {
  try {
    const apiKey = await adminModel.find()

    const configuration = new Configuration({
      organization: "org-GrIyXY6eAfFOhHV1JzWPE2W2",
      apiKey: apiKey[apiKey.length - 1]["API_CHATGBT"],
    });

    const openai = new OpenAIApi(configuration);

    const resApi = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: req.body.prompt,
      temperature: 0,
      max_tokens: 2000,
    });

    res.status(201).json({
      success: true,
      prompt: resApi.data.choices[0].text,
      name : "chatbot"
    });

  } catch (error) {
    next(error)
  }
});

app.use(errorHandler)

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Running on port", PORT);
    });
  })
  .catch((e) => {
    console.log(e);
    console.log("Server not Runing error on port ", PORT);
  });
