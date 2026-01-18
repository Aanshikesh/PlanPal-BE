const express=require('express')
const { userModel, todosModel } = require('../db')
const Router=express.Router()
Router.use(express.json())
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {userMiddleWare} =require('../middlewares/user')
const { JWT_SECRET } = require('../config')

Router.post("/signup",async (req,res)=>{
    try{
        const {username,email,password}=req.body
        const hashedPassword=await bcrypt.hash(password,10)
        const AlreadyExist=await userModel.findOne({
            username:username,
        })
        if(AlreadyExist){
            // Duplicate User
            res.status(409).json({
                message:"User already registered"
            })
        }
        else{
            await userModel.create({
            username:username,
            email:email,
            password:hashedPassword
            })
            // Successful
            res.status(200).json({
                "Message":"You have been successfully registered"
            })
        }
    }
    catch(error){
        console.log("Error is : "+error);
        res.status(500).json({
            "Message":"Unknown Error Occured"
        })
    }   
    
})

Router.post("/signin",async (req,res)=>{
    try{
        const {username,password}=req.body
        const user=await userModel.findOne({
            username:username
        })
        if(!user){
            res.status(404).json({
                Message:"You have not Signed-Up"
            })
        }
        else{
            const passCheck=await bcrypt.compare(password,user.password)
            if(!passCheck){
                res.status(400).json({
                    Message:"Password Incorrect"
                })
            }
            else{
                const JWT=jwt.sign({
                    userId:user._id
                },JWT_SECRET)
                res.status(200).json({
                    "Token":JWT
                })
            }
        }
    }
    catch(error){
        console.log("Error is : "+error);
        res.status(500).json({
            "Message":"Unknown Error Occured"
        })
    }
    
})

Router.use(userMiddleWare)

Router.get('/getUserInfo',async (req,res)=>{
    const userId=req.userId
    try{
        const user=await userModel.findById(userId)
        res.json({
            "userName":user.username
        })
    }
    catch(error){
        console.log(error)
    }
})

Router.get('/getTodo',async (req,res)=>{
    try{
    const todos=await todosModel.find({
        creatorId:req.userId
    })
    res.status(200).json({
        todos:todos
    })
    }
    catch(error){
        console.log("Error is : "+error);
        res.status(500).json({
            "Message":"Internal Server Error"
        })
    }
})

Router.post('/addTodo',async (req,res)=>{
    try{
    const {title,description,urgency,dueDate}=req.body
    
    const newTodo=await todosModel.create({
        creatorId:req.userId,
        title:title,
        description:description,
        urgency:urgency,
        doneOrNot:false,
        dueDate:dueDate
    })

    res.status(200).json({
        newTodo:newTodo
    })
    }
    catch(error){
        console.log("Error is : "+error);
        res.status(500).json({
            "Message":"Internal Server Error"
        })        
    }

})

Router.post('/delTodo',async (req,res)=>{
    try{
    const toBeDeletedId=req.body.todoId
    const userId=req.userId

    await todosModel.deleteOne({
        _id:toBeDeletedId,
        creatorId:userId
    })

    res.status(200).json({
        Message:"todo has been deleted"
    })
    }
    catch(error){
        console.log("Error is : "+error);
        res.status(500).json({
            "Message":"Internal Server Error"
        })    
    }
})

Router.post('/editTodo',async (req,res)=>{
    try{
    const toBeUpdatedId=req.body.todoId
    const {doneOrNot}=req.body
    const userId=req.userId
    
    const result=await todosModel.updateOne({
        _id:toBeUpdatedId,
        creatorId:userId
    },{$set:{
        creatorId:req.userId,
        doneOrNot:doneOrNot
    }
    })
    
    res.status(200).json({
        Message:"todo has been updated"
    })
    }
    catch(error){
        console.log("Error is : "+error);
        res.status(500).json({
            "Message":"Internal Server Error"
        })    
    }
})

module.exports={
    userRouter:Router
}