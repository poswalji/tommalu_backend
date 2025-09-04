const express=require('express');
const router=express.Router();



router.get('/items',(req,res)=>{

    res.json([
        { id: 1, name: "Pizza", price: 250 },
        { id: 2, name: "Burger", price: 150 },
        { id: 3, name: "Pasta", price: 200 }
    ]);
});


module.exports=router;