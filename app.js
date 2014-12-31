var express = require('express');
var path = require('path');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
var link = process.argv.slice(2).toString();
app.get('/scrape', function(req, res){
    //link = 'http://www.imdb.com/title/tt1229340/';

    request(link, function(err, res, html) {
        if(!err) {
            //Loading the DOM from the link
            $ = cheerio.load(html);

            //Scrape Variables
            var title, ratings, release;
            json = {title: "", ratings: "", release: ""};

            $('header').filter(function(){
                var data = $(this);
                title = data.children().first().text();
                release = data.children().last().children().text();
                json.title = title;
                json.release = release;
            });
            $('.star-box-giga-star').filter(function (){
                data = $(this);
                ratings = data.text();
                json.ratings = ratings;
            });

        }
        else if (err) {
            res.write("ERROR")
        }

       fs.writeFile('output.json', JSON.stringify(json, null, 4),function(err){
           console.log("files successfully written");
       });

    });
    res.send('Check your Terminal');
});

app.listen('8000');
console.log('Listening at port 3000');
exports = module.exports = app
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
