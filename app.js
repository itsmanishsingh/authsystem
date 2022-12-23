require("dotenv").config();
const express = require('express')
const app = express();
app.use(express.json())
const User = require('./model/user')

app.get("/", (req,res)=>{
    res.send("<h1>Hello from Auth_system -LCO</h1>")
})

app.post("/register", async (req,res)=>{
    const { firstname, lastname, email, password} = req.body

    if(!(email && password && firstname && lastname)){
        res.status(400).send(`All the fields are required`);
    }
    const existingUser = await User.findOne({ email })

    if(existingUser){
        res.status(401).json(`User already exists`);
    }
});

module.exports= app;
