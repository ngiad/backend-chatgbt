import { Schema, model } from "mongoose";

const admindSchema = new Schema({
    API_CHATGBT : {
        type : String,
        required : true
    }
})

export default model("admin", admindSchema);