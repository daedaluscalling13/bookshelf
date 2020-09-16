var express = require('express');
var request = require('request');
const xml2js = require('xml2js');
const fs = require('fs');

var apiKey = 'kUNQHUhbZZWTFUPqXk1iXw';
var apiSecret = 'h6l8gxqtRURnloale4gSvLLL6MI4IWNtGVt3U5xpSk';

var app = express();
var exhandlebars = require('express-handlebars');
var handlebars = exhandlebars.create({
  defaultLayout:'main',
  helpers: {
    createCarousel: (image_array) => {
      carouselHtml = "<div id='carouselExampleSlidesOnly' class='carousel slide' data-ride='carousel'>\n";
      carouselHtml = carouselHtml + "\r<div class='carousel-inner'>\n";
      carouselHtml = carouselHtml + "\r\r<div class='carousel-item active'>\n";
      carouselHtml = carouselHtml + "\r\r\r<img class='d-block w-100' src='" + image_array[0] + "'>\n"
      carouselHtml = carouselHtml + "\r\r</div>\n"
      carouselHtml = carouselHtml + "\r\r<div class='carousel-item'>\n";
      carouselHtml = carouselHtml + "\r\r\r<img class='d-block w-100' src='" + image_array[1] + "'>\n"
      carouselHtml = carouselHtml + "\r\r</div>\n"
      carouselHtml = carouselHtml + "\r</div>\n"
      carouselHtml = carouselHtml + "</div>\n"
      // carouselHtml = "<img class='d-block w-100' src='" + image_array[0] + "'>"
      return carouselHtml;
    }
  }
  });

var path = require('path')

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8003);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res,next){
  var context = {};

  request('https://www.goodreads.com/review/list?v=2&id=120733123&shelf=to-read&key=' + apiKey, function(err, response, body){
    if(!err && response.statusCode < 400){

      xml2js.parseString(response.body, (err, result) => {
        if(err){
          throw err;
        }
        
        // context.image_url = result["GoodreadsResponse"]["reviews"][0]["review"][0]["book"][0]["image_url"][0];

        context.image_array = [];
        result["GoodreadsResponse"]["reviews"][0]["review"].forEach((item, index) => {
          context.image_array.push(result["GoodreadsResponse"]["reviews"][0]["review"][index]["book"][0]["image_url"][0]);
        })
        
        res.render('home', context);
      });

    } else {
      if(response){
        console.log(response.statusCode);
      }
    }
  });
});

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