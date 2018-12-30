
import path from 'path';


const express=require('express');
const router=express.Router();
module.exports = () => {
    router.get('/',(req,res)=>{
        console.log("home loaded")

        //res.json(data)

        //return res.send('Index router');
        res.sendFile(path.join(__dirname,'../public/html/index.html'))
        
        
    })
    return router;
}