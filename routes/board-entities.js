import data from '../data/data.json';
import path from 'path';

const express=require('express');
const router=express.Router();
const moment=require('moment');
const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './data/ranban.db';
const DB = new sqlite3.Database(DB_PATH, function(err){
    if (err) {
        console.log(err)
        return
    }
    console.log('Connected to ' + DB_PATH + ' database.')
    
    //DB.close()
});

router.get('/',(req,res)=>{
    console.log("board-entries loaded")
    //console.log(Object.keys(data))
    //res.json(data)

    //return res.send('Index router');
    

    
    res.sendFile(path.join(__dirname,'../public/html/board-entities.html'))
    
})
router.get('/workflows/:id',(req,res)=>{
    let entity_id=req.params.id;
    DB.all(
        'select * from workflow WHERE entity_id=$id',
        {$id: entity_id},
        (err,rows)=>{
            res.send(rows);
        }
    )
})

const bodyParser=require('body-parser')
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.post('/workflows',(req,res)=>{
    DB.all(
        'select * from workflow WHERE entity_id=$entity',
        {$entity: req.body.entity},
        (err,rows)=>{
            if (err){
                console.log(err)
            }
            console.log(rows);
            res.send(rows);
    })
})

module.exports=router;