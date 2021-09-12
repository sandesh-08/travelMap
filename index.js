const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app=express();
const pinRoutes = require("./routes/pins");
const userRoutes = require("./routes/users");
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());

mongoose.connect("mongodb+srv://mapAppAdmin:NKvLrFyYjOaOpiag@cluster0.3bhcc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(()=>{
    console.log("MONGODB Connected!!!!");
}).catch((err)=>console.log("error with mongodb ",err));

app.get("/",(req,res)=>{
    res.send("running", `${process.env.MONGO_URL}`);
})

app.use("/api/users", userRoutes);
app.use("/api/pins", pinRoutes);

app.listen(PORT,()=>console.log("backend server is running "));