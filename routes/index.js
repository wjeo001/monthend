import data from '../data/data.json';
import path from 'path';

const express=require('express');
const router=express.Router();

module.exports = () => {
    router.get('/',(req,res)=>{
        //res.json(data)
        //return res.send('Index router');
        //res.sendFile(path.join(__dirname,'../public/home'))
        res.sendFile(path.join(__dirname,'../public/html/index.html'))
        
    })
    return router;
}