var amqp = require('amqp'), util = require('util');

var customer = require('./services/customer');
var admin = require('./services/admin');


//var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
//var mongoStore = require("connect-mongo")(expressSession);
//var mongo = require("./services/mongo");

//mongo.connect(mongoSessionConnectURL, function(){
//	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
//});  

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	console.log("listening on admin_queue");

	cnn.queue('admin_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.handleRequest(message, function(err,res){
				console.log("Listening admin_queue"+message);
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

cnn.on('ready', function(){
	console.log("listening on sensor_queue");

	cnn.queue('sensor_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.getSensorList(message, function(err,res){
				console.log("Listening sensor_queue"+message);
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
	console.log("listening on usersensor_queue");

	cnn.queue('usersensor_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			customer.getUserSensorList(message, function(err,res){
				console.log("Listening sensor_queue"+message);
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
	console.log("listening on subscribesensor_queue");

	cnn.queue('subscribesensor_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			customer.subscribeSensor(message, function(err,res){
				console.log("Listening subscribesensor_queue"+message);
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
	console.log("listening on sensor_queue");

	cnn.queue('addAdminSensor_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			admin.addAdminSensor(message, function(err,res){
				console.log("Listening sensor_queue"+message);
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