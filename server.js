var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var url = 'url';


// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db.close();
});


var app = express();
app.use(compression());
// var appHelpers = {};
app.use(express.static(__dirname + '/static'));


//for body parser
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));

//to get list of all timezons
app.get('/timezones', function(req, res) {

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    db.collection('timezones').find({}).toArray(function(err, docs) {
      if(err)
      {
        //if an error occured while connecting to the server
        res.send({
         "status": "FAIL",
         "statusCode": 403,
         "message": "Can not connect to the server."
        });
      }
      else {
        res.send(docs);
      }

    });

  });
});

//to get recent date
app.get('/recentDate', function(req, res) {

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    db.collection('dateList').find().limit(1).sort({$natural:-1}).toArray(function(err, docs) {
      if(err)
      {
        //if an error occured while connecting to the server
        res.send({
         "status": "FAIL",
         "statusCode": 403,
         "message": "Can not connect to the server."
        });
      }
      else {
        res.send(docs);
      }

    });

  });
});

//insert new date
app.post("/addDate",function(req,res){

	//parse date sent by an user
	var rawToStr = JSON.parse(req.rawBody);
	
	MongoClient.connect(url, function(err, db) {
	    assert.equal(null, err);
		db.collection('dateList').insertOne( {
		     'dateEntered': rawToStr.customDate
		  }, function(err, result) {
		   assert.equal(err, null);

		   //if error occured while adding data
		   if(err != null)
		   {
		     //if an error occured while connecting to the server
		     res.send({
		      "status": "FAIL",
		      "statusCode": 403,
		      "message": "Error occured while connecting to the server."
		     });

		   }
		   else
		   {
		     db.close();
		     //date added successfully
		     res.send({
		      "status": "SUCCESS",
		      "statusCode": 200,
		      "message": "Date added successfully."
		     });

		   }

		});
	});

});

app.listen(process.env.PORT || 8000);


