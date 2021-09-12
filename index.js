const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app=express();
const pinRoutes = require("./routes/pins");
const userRoutes = require("./routes/users");
const cors = require('cors');
const PORT = process.env.PORT || 8800;

dotenv.config();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(()=>{
    console.log("MONGODB Connected!!!!");
}).catch((err)=>console.log("error with mongodb ",err));

app.get("/",(req,res)=>{
    res.send(`running`);
})

app.use("/api/users", userRoutes);
app.use("/api/pins", pinRoutes);

app.listen(PORT,()=>console.log("backend server is running "));