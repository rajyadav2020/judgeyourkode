const express = require('express')

const app = express()
require('dotenv').config()
const connectDB = require('./config/db')
const redisClient = require('./config/redis')
const cookieparser = require('cookie-parser')
const authRouter = require('./routes/userAuth')

app.use(express.json())
app.use(cookieparser())

app.use('/user',authRouter)

const initializeconnection = async () => {
  try{
    await Promise.all(
     [connectDB(),redisClient.connect()]
    );
    console.log('Connected to MongoDB and Redis successfully');
    app.listen(process.env.PORT, () => {
          console.log(`Server running on port ${process.env.PORT}`); })
  }
  catch(err){
    console.log(err)
  }
}

initializeconnection()
