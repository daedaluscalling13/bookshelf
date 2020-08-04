var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require('path')

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8003);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/public', express.static(path.join(__dirname, 'public')));

const selectAllQuery = 'SELECT * FROM foodlog';
const insertQuery = "INSERT INTO foodlog (`date`, `name`, `calories`, `carbs`, `protein`, `fats`, `fiber`) VALUES (?, ?, ?, ?, ?, ?, ?)";
const deleteQuery = "DELETE FROM foodlog WHERE id=?";
const updateQuery = "UPDATE foodlog SET date=?, name=?, calories=?, carbs=?, protein=? fats=? fiber=? WHERE id=? ";
const dropTableQuery = "DROP TABLE IF EXISTS foodlog";
const makeTableQuery = `CREATE TABLE foodlog(
                        id INT PRIMARY KEY AUTO_INCREMENT,
                        date DATE,
                        name VARCHAR(255) NOT NULL,
                        calories INT,
                        carbs FLOAT,
                        protein FLOAT,
                        fats FLOAT,
                        fiber FLOAT)`;

const getAllData = (res) => {
  mysql.pool.query(selectAllQuery, function(err, rows, fields){
    if(err){
      next(err);
      return;
    }

    res.json({ rows: rows });
  });
}

app.get('/',function(req,res,next){
  var context = {};
  res.render('home', context);
});

app.get('/new_daily_entry', function(req, res, next){
  var context = {};
  res.render('new_daily_entry', context)
})

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});