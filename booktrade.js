var express = require('express');
var bodyParser = require('body-parser');
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
  //res.send('welcome, ' + req.body.userid1)
 // res.sendFile(__dirname + '/dashboard.html');
  res.render('dashboard.hbs', {
    userName: req.body.userid1,
    currentYear: new Date().getFullYear()
  });
})

app.post('/signup', urlencodedParser, function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('name =  ' + req.body.name)
  res.send('city =  ' + req.body.city)
  res.send('state = ' + req.body.state)
  res.send('userid = ' + req.body.userid2)
  res.send('pass = ' + req.body.pass)
})

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});