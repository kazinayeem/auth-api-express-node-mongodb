const express = require("express")
const dotenv = require("dotenv")
const todoHandeler = require("./routeHandeler/todoHandeler")
const userHandeler = require("./routeHandeler/userHandeler")
const mongoose = require('mongoose');

const app = express();
dotenv.config();
app.use(express.json());


mongoose
    .connect('mongodb://127.0.0.1:27017/todos', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("connect successful"))
    .catch(err => console.log(err))



app.use("/todo", todoHandeler)
app.use("/user", userHandeler)

app.get("/", (req, res) => {
    res.send("<h1>_This is home route</h1>")
})


// const errorHandeler = (err,req,res,next) => {
//     if(res.headersent) {
//          return next(err);
//     }
//     res.status(500).json({
//         error : err
//     })
// }

// app.use(errorHandeler);


app.listen(1080, () => {
    console.log("server is running port 1080");

})