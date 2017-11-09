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
           	res.render('dashboard.hbs', {
  		     userName: req.body.userid1,
  		     currentYear: new Date().getFullYear()
  		   });
  		  //res.redirect('../views/dashboard')
        console.log('redirect successful')

          }else{
          	console.log('no')
          }
      }else{
            console.log('no')  
      }
    });
  });
});


app.get('/dashboard', function(req, res){
	res.render('dashboard.hbs', {
    userName: req.body.userid1,
    currentYear: new Date().getFullYear()

  });
});

app.post('/signup', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)

  //DB connection for signup
  console.log("this is coming")
  MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server for book add request');

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
});

app.post("/addbooks", urlencodedParser, function (req, res) {
      //DB connection for signup
    MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
      if (err) {
        return console.log('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server for signup request');

      // Insert new doc into userInfo collection
      db.collection('userInfo').insertOne({
        userid: req.body.userid,
        isbn: req.body.isbn,
        title: req.body.title,
        price: req.body.price,
        author: req.body.author
      }, (err, result) => {
        if (err) {
          return console.log('Unable to insert book', err);
        }

        console.log(result.ops);
      });

      db.close();
    });
    res.send("Book record added!")
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});