const mongoose = require("mongoose")
const {Schema, model} = mongoose

const UserSchema = new Schema ({
    name : {type:"string" , required: true, max: 6, unique: true},
    email: {type:"string", required:true},
    password: {type:"string", required:true},
    todoList: [{
      _id: { type: Schema.Types.ObjectId, default: function(){return new mongoose.Types.ObjectId().toString()}, sparse: true},
      task: { type: "string", sparse:true},
    }],
})

const UserModel = model("User", UserSchema)
module.exports = UserModel


