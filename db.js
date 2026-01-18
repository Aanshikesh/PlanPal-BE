const mongoose=require('mongoose')
const { string, boolean } = require('zod')
const Schema=mongoose.Schema
const ObjectId=mongoose.Types.ObjectId

const userSchema=new Schema({
    username:String,
    email:String,
    password:String
})

const todoSchema=new Schema({
    creatorId:ObjectId,
    title:String,
    description:String,
    urgency:String,
    doneOrNot:Boolean,
    dueDate:String
})

const userModel=mongoose.model('users',userSchema)
const todosModel=mongoose.model('todos',todoSchema)

module.exports={
    userModel,
    todosModel
}

