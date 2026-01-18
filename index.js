require('dotenv').config()
const express=require('express')
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cors())
const mongoose=require('mongoose')
const { userRouter } = require('./routes/user')
const { MONGO_URL } = require('./config')

app.use('/user',userRouter)

async function main(){
    
    await mongoose.connect(MONGO_URL)
    app.listen(3000)
    console.log("Server has Started ... ");
}

main()
