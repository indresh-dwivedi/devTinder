const express = require("express")

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth")

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
    res.send("User logged in Successfully");
});

app.get("/user/data", userAuth, (req, res) => {
    res.send("User Data Sent");
});

app.get("/admin/getAllData", (req, res) => {
    res.send("All Data Sent");
});

app.get("/admin/deleteUser", (req, res) => {
    res.send("Delete a User");
});

app.listen(7777, () => {
    console.log("server is successfully listening on port 7777....")
});
