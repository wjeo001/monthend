import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';


const app=express();
const PORT=3000;
const routes=require('./routes');
const routesHome=require('./routes/home.js');
const routesBacklog=require('./routes/backlog')
const routesBoard=require('./routes/board')
const routesBoardEntities=require('./routes/board-entities')
const routesRecentActivity=require('./routes/indexrecentactivity')

//express method - add specific middleware to path
//public folder on path /
app.use(express.static(__dirname+ '/public'));

//express method - use json
//app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/',routes());
app.use('/home',routesHome());
app.use('/backlog',routesBacklog);
app.use('/board',routesBoard);
app.use('/board-entities',routesBoardEntities);
app.use('/indexrecentactivity',routesRecentActivity);


// JSON data
// {"hello": "JSON is cool"}
// URLEncoded data
// hello=JSON+is+cool
app.post('/newItem',(req,res) =>{
    console.log(req.body);
    res.send(req.body);
    
});

app.get('/item/:id', (req,res,next)=>{
    // middleware that pulls the data
    console.log(req.params.id);
    let user=Number(req.params.id);
    console.log(user);
    console.log(data[user]);
    // middleware that uses the req object
    console.log('Request from: '+req.originalUrl);
    console.log('Request type: '+req.method);
    
     // everything above is middleware
    res.send(data[user]); //send data to the browser
    next();
}, (req,res) =>
    console.log('did you get the right data?')
);

app.route('/item')
    .get((req,res) => {
        throw new Error();
        //res.download('images/rocket.jpg')
        //res.redirect('http://www.google.com')
        //res.end()
        //res.send('a get request with /item route on port '+PORT)
    })
    .put((req,res)=>
        res.send('a put request with /newItem route on ' + PORT)
    )
    .delete((req,res)=>
        res.send('a DELETE request with /item route on port '+PORT)
    )
;



// Error handling function 
/*app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Red alert! Red alert!:'+err.stack);
}) ;*/

app.listen(PORT,()=> {
    console.log('Server is running on port ' + PORT)
    //console.log(data);
});

