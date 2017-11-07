var express = require('express');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const hbs = require('hbs');

var app = express()

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)

  //check in the DB if user present or not
  MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server for login request');
  //check userid is present in DB or not
  db.collection('userInfo').find({userid: req.body.userid1}).toArray().then((docs) => {
    
    if(docs.length){
        console.log(docs[0].password)
        if(docs[0].password==req.body.pass1){
        	console.log('congratulation')
        	//dis
        	res.render('dashboard.hbs', {
		    userName: req.body.userid1,
		    currentYear: new Date().getFullYear()
		  });

        }else{
        	console.log('password does not match')
        }
    }else{
          console.log('Username does not exists')  
    }
  });

  // db.close();
});




  //res.send('welcome, ' + req.body.userid1)
 // res.sendFile(__dirname + '/dashboard.html');
  // res.render('dashboard.hbs', {
  //   userName: req.body.userid1,
  //   currentYear: new Date().getFullYear()
  // });
})

app.post('/signup', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)

  //DB connection for signup
  console.log("this is coming")
  MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server for signup request');

    // Insert new doc into userInfo collection
    db.collection('userInfo').insertOne({
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      password: req.body.pass,
      userid: req.body.userid2
    }, (err, result) => {
      if (err) {
        return console.log('Unable to insert user', err);
      }

      console.log(result.ops);
    });

    db.close();
  });

  res.render('dashboard.hbs', {
    userName: req.body.userid2,
    currentYear: new Date().getFullYear()
  });


})

app.post("/addbooks", urlencodedParser, function (req, res) {
    //var obj = JSON.parse(res)
    console.log(req.body.title)
    res.send('ok');
});



app.listen(3000, () => {
  console.log('Server is up on port 3000');
});