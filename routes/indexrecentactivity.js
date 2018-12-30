
import path from 'path';


const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    console.log("recent activity loaded")
    //console.log(Object.keys(data))
    //res.json(data)

    //return res.send('Index router');
    res.sendFile(path.join(__dirname,'../public/html/index-recent-activity.html'))
    
    
})

module.exports=router;