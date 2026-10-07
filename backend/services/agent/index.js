import express from "express"
import  router  from "./routes/agent.route.js"

const port=process.env.PORT

const app=express()
app.use(express.json())
app.use("/",router)

app.get("/", (req,res) => {
    res.json({message:"Hello from agent!!"})
})

app.listen(port, (req,res)=> {
    console.log(`Agent started at ${port}`)
})