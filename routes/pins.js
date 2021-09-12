const router = require("express").Router();
const Pin = require("../models/Pin");

// create a pin
router.post("/",async(req,res)=>{
    const newPin = new Pin(req.body);
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin);
    }catch(err){
        res.status(500).json(err);
    }
})


// get all pina
router.get("/",async(req,res)=>{
    try{
        const pins = await Pin.find();
        res.status(200).json(pins);
    }catch(err){
        res.status(500).json(err);
    }
})

// get using id
router.get("/:id",async(req,res)=>{
    try{
        const pins = await Pin.find({_id: req.params.id});
        res.status(200).json(pins);
    }catch(err){
        res.status(500).json(err);
    }
})

// delete pins using id
router.delete("/delete/:id",async(req,res)=>{
    try{
        const deletedPin=await Pin.deleteOne({_id: req.params.id});
        res.status(200).json(deletedPin);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router ;