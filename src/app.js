const express = require("express");
require("dotenv").config({});
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        // Creating a new instance of the User Model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User Added Successfully");
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
    
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            // Create a JWT Token

            const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");

            // Add the token to the cookie and send the response back to the server
            res.cookie("token", token);
            res.send("Login Successfully!!");
        }
        else {
            throw new Error("Invalid Credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

app.get("/profile", async (req, res) => {
    try {
        const cookies = req.cookies;

        const {token} = cookies;
        // Validate my token
        if (!token) {
            throw new Error("Invalid Token");
        }
    
        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

        const { _id } = decodedMessage;
    
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist");
        }

        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try {
        console.log(userEmail);
        const user = await User.findOne({emailId : userEmail});
        if(!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
        /*
        const users = await User.find({ emailId : userEmail });
        if(users.length === 0) {
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }
        */
    } catch (error) {
        res.status(400).send("Something went wrong");
    }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) =>{
    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// Delete a user from the database
app.delete("/user", async (req, res) => {

    const userId = req.body.userId;
    try {
        
        const user = await User.findByIdAndDelete({ _id: userId });
        //const user = await User.findByIdAndDelete(userId);
        res.send("User deleted Successfully");

    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// Update data of the database
app.patch("/user/:userId", async (req, res) => {

    const userId = req.params?.userId;
    const data = req.body;
    
    try {
        const ALLOWLED_UPDATES = [
            "photoUrl", "about", "gender", "age", "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) => 
            ALLOWLED_UPDATES.includes(k)
        );

        if(!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }
        if(data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");

    } catch (err) {
        res.status(400).send("UPDATE FAILED:"+ err.message);
    }
});


connectDB()
    .then(() => {
        console.log("Database connection established...");
        app.listen(7777, () => {
            console.log("server is successfully listening on port 7777....")
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected!!");
    });
