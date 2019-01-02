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
    console.log("board loaded")
    //console.log(Object.keys(data))
    //res.json(data)

    //return res.send('Index router');
    res.sendFile(path.join(__dirname,'../public/html/board.html'))
    
    
})

router.get('/:id',(req,res)=>{
    DB.all(
        'select * from columnitems WHERE parent_id=$id',
        {$id: req.params.id},
        (err,rows)=>{
            if (err){
                console.log(err)
            }
            console.log(rows);
            res.send(rows);
    })
})
router.get('/cards/:id/:col_id',(req,res)=>{
    DB.all(
        'select id,sort_order,text,strftime(\'%Y-%m-%d\',due_date) as due_date,workflow_id from card WHERE workflow_id=$id and column_position=$col_id order by sort_order',
        {
            $id: req.params.id,
            $col_id: req.params.col_id
        },
        (err,rows)=>{
            if (err){
                console.log(err)
            }
            console.log(rows);
            res.send(rows);
    })
})

router.get('/columns/:id',(req,res)=>{
    console.log("columns")
    
})


module.exports=router;