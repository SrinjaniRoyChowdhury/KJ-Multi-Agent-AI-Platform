import express from "express"
import dotenv from "dotenv"

dotenv.config()

const port=process.env.PORT

const app=express()

app.get("/", (req,res) => {
    res.json({message:"Hello from agent!!"})
})

app.listen(port, (req,res)=> {
    console.log(`Agent started at ${port}`)
})