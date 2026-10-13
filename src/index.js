const express = require('express')

const app = express()
require('dotenv').config()
const connectDB = require('./config/db')
const cookieparser = require('cookie-parser')

app.use(express.json())
app.use(cookieparser())

connectDB()
.then(async ()=>{
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
  })
})