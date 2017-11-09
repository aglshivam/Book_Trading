var express = require('express');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const hbs = require('hbs');

var app = express()

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

var urlencodedParser = bodyParser.urlencoded({
  extended: false
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', urlencodedParser, function(req, res) {
  if (!req.body) return res.sendStatus(400)

  //check in the DB if user present or not
  MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server for login request');
    //check userid is present in DB or not

    db.collection('userInfo').find({userid: req.body.userid1}).toArray().then((docs) => {
      db.close();
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
            res.send("no")
          }
      }else{
            console.log('no')
            res.send("no")  
      }
    });
  });
});


app.get('/dashboard', function(req, res){
  console.log(req.query.userid1)
	res.render('dashboard.hbs', {
    userName: req.query.userid1,
    currentYear: new Date().getFullYear()
  });
});


app.post('/signup', urlencodedParser, function(req, res) {
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
      db.collection('bookInfo').insertOne({
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

app.get("/viewbooks", function (req, res) {
      //DB connection for signup
    MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
      if (err) {
        return console.log('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server for viewing books request');
      //check userid is present in DB or not
      db.collection('bookInfo').find().toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2))
          res.send(JSON.stringify(docs, undefined, 2));
      });

      db.close();
    });
});

app.get("/buybooks", function (req, res) {
      //TODO: Add deal to deal collection
    MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
      if (err) {
        return console.log('Unable to connect to MongoDB server');
      }
      console.log('Connected to MongoDB server for viewing books request');
      //check userid is present in DB or not
      db.collection('deals').insertOne({
        isbn: req.body.isbn
      }, (err, result) => {
        if (err) {
          return console.log('Unable to insert book', err);
        }
        console.log(result.ops);
      });

      db.close();
    });

});

app.get('/viewProfile', function(req, res) {
  console.log("inside viewProfile")
  MongoClient.connect('mongodb://localhost:27017/db', (err, db) => {
    if (err) {
      return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server for view profile');

    //   db.collection('userInfo').find({userid: 'shivam'}).toArray().then((docs) => {
    //   console.log(JSON.stringify(docs, undefined, 2));
    //   res.send(JSON.stringify(docs, undefined, 2))
    // })
    db.collection('userInfo').find({
      userid: 'shivam'
    }).toArray(function(err, result) {
      if (err) {
        console.log(err)
        res.json(err)
      } else {
        console.log(result[0])
        res.json(result)
      }
    })
    db.close();
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
