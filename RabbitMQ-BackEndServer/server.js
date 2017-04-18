var amqp = require('amqp'), util = require('util');

var customer = require('./services/customer');
var doctor = require('./services/doctor');


//var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
//var mongoStore = require("connect-mongo")(expressSession);
//var mongo = require("./services/mongo");

//mongo.connect(mongoSessionConnectURL, function(){
//	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
//});  

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on doctor_queue");

	cnn.queue('doctor_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			doctor.handleRequest(message, function(err,res){
				console.log("Listening doctor_queue"+message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});	
});

cnn.on('ready', function(){
	console.log("listening on customer_queue");

	cnn.queue('customer_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			customer.handleRequest(message, function(err,res){
				console.log("Listening customer_queue"+message);
				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});	
});

