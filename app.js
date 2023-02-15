require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
app.use(express.json());
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Home Page of Auth_System</h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(email && password && firstname && lastname)) {
      res.status(400).send(`All the fields are required`);
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).json(`User already exists`);
    }

    myencPassword = await bcrypt.hash(password,10);

    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: myencPassword
    });

    // Token creation
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    user.token = token;
    // Update or not

    // Handle the password
    user.password = undefined;

    // Send token or send just success yes and redirect -choice
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login",async(req,res)=>{

  try {
    const { email , password} = req.body;

    // If the fields are not there
    if(!(email && password)){
      res.status(401).json(`All fields are mandatory`);
    }

    // Searching for the User in Database
    const user = await User.findOne({email});

    /*
    If the user is not there in the database
    if(user){
      res.status(201).json(`User is new kindly sign in first`);
    }
    */

    // If the user is present in the database Checking the password 
    if(user && (await bcrypt.compare(password,user.password))){
      const token = jwt.sign(
        {user_id : user._id , email},
        process.env.SECRET_KEY,
        {
          expiresIn:"2h"
        }
      )

      user.token = token;
      user.password = undefined;
      // res.status(201).json(user);
      
      // if you want to use cookies
      const options = {
        expires : new Date( Date.now()+3*24*60*60*1000),
        httpOnly: true,
      };
      res.status(201).cookie("token" , token ,options).json({
        success : true,
        token,
        user,
      })
    }

    res.status(400).send(`Email or password does not match with the database`)
    
  } catch (error) {
    console.log(error);
  }
})

app.get("/dashboard" , auth,(req,res)=>{
  res.status(201).json(`Welcome to the Secret dashboard `)
})

module.exports = app;
