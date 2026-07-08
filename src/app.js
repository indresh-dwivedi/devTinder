const express = require("express")

const app = express();

// app.use("/route", rh1, rh2, [rh3, rh4], rh5);

app.get( 
    "/user", 
    (req, res, next) => {
        console.log("Handling the route user 1!!")
        // res.send("Response!!");
        next();
    },
    (req, res, next) => {
        console.log("Handling the route user 2!!")
        // res.send("2nd Response!!");
        next();
    },
    (req, res, next) => {
        console.log("Handling the route user 3!!")
        // res.send("3rd Response!!");
        next();
    },
    (req, res, next) => {
        console.log("Handling the route user 4!!")
        // res.send("4th Response!!");
        next();
    },
    (req, res, next) => {
        console.log("Handling the route user 5!!")
        res.send("5th Response!!");
    }
)

app.listen(7777, () => {
    console.log("server is successfully listening on port 7777....")
});
