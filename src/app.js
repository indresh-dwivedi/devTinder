const express = require("express")

const app = express();

app.use("/", (err, req, res, next) => {
    if (err) {
        // Log your error
        res.status(500).send("something went wrong");
    }
});

app.get("/getUserData", (req, res) => {
    // Logic of DB call and get user data

    try {
        throw new Error("acbdjsk");
        res.send("User Data Sent");
    } catch (error) {
        res.status(500).send("some error contact support team");
    }
});

app.use("/", (err, req, res, next) => {
    if (err) {
        // Log your error
        res.status(500).send("something went wrong");
    }
});

app.listen(7777, () => {
    console.log("server is successfully listening on port 7777....")
});
