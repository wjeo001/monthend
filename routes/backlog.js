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
router.get('/loglist/:dueday',(req,res)=>{
    let id=req.params.dueday
    /*DB.all('select * from card where id='+id,(err,rows)=>{
        if (err){
            console.log(err)
        }
        console.log(rows);
    })
    */
    
    res.redirect('/backlog')
})
router.get('/GetList',(req,res)=>{
    DB.all('select * from card',(err,rows)=>{
        if (err){
            res.send(err)
        }
        res.send(rows);
    })
})
router.get('/GetList/:id',(req,res)=>{
    let getID=req.params.id;
    DB.all(
        'select * from card where id=$id',
        {$id: getID},
        (err,rows)=>{
            res.send(rows[0]);
        }
    )
})

const bodyParser=require('body-parser')
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.post('/GetListByDueDate',(req,res)=>{
    console.log(JSON.stringify(req.body.theDate));
    console.log(JSON.stringify(req.body.dday));
    console.log(req.body.theDate);
    var temp_date=moment(req.body.theDate,"YYYY-MM-DD").subtract(req.body.dday,'days');
    console.log(temp_date);
    
    DB.all(
        'select * from card where due_date>=$id',
        {$id: temp_date.format("YYYY-MM-DD")},
        (err,rows)=>{
            res.send(rows);
        }
    )
})

router.get('/',(req,res)=>{
    console.log("backlog loaded")
    //console.log(Object.keys(data))
    //res.json(data)

    //return res.send('Index router');
    res.sendFile(path.join(__dirname,'../public/html/backlog.html'))
    
    
})
/*
    `text`	VARCHAR ( 120 ),
	`column`	VARCHAR ( 120 ),
	`color`	VARCHAR ( 7 ),
	`modified`	DATETIME,
	`archived`	BOOLEAN,
	`sort_order`	INTEGER,
	`due_date`	DATETIME,
	`workflow_id`	INTEGER,
    `column_position`	INTEGER,
*/
router.post('/newtask',(req,res)=>{
    var text=req.body.text
    var column=req.body.column
    var due_date=req.body.due_date
    var workflow_id=req.body.workflow_id
    var column_position=req.body.column_position
    /*need to define modified,sort_order */
    /* get the max sort_order number and assign new sort_order=max(sort_order)+1 */
    console.log(text)
    DB.get(
        'select sort_order from card where workflow_id=$wid and column_position=$colpos order by sort_order desc limit 1',
        {
            $wid: workflow_id,
            $colpos: column_position
        },
        (err,rows)=>{
            if (err){
                console.log(err)
            }
            else{
                DB.run(
                    'insert into card (text,column,due_date,workflow_id,column_position,modified,sort_order) values (?,?,?,?,?,?,?)',
                    text,column,due_date,workflow_id,column_position,moment(),(rows.sort_order+1),
                    function(err){
                        if (err) {
                            throw err
                        }
                        else{
                            //res.redirect('/')
                        }
                    }
                )
                //res.send(rows);
            }
            res.send(rows)
        }
    )

})

module.exports=router;