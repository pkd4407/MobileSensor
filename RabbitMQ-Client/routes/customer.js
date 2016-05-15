
var mq_client = require('../rpc/client');
var ejs= require('ejs');

function signup(req,res){
	
	if(req.session.customer_id){
		
		res.render("customerDashboard");
	}
	else{
		
		res.render("signupCustomer");
	}
}

function login(req,res){
	
	/*if(req.session.customer_id){
		
		res.render("customerDashboard");
	}
	else{*/
		
		res.render("loginCustomer");
	//}
}

function signupCustomer(req,res){
	
	//var customer_id = req.param('email');
	var email 	 = req.param('email');
	var password = req.param('password');
	
	var msg_payload = {"email" : email, "password" : password, "type" : "signupCustomer" };
	
	mq_client.make_request('customer_queue', msg_payload, function(err,results) {
    	
        console.log(results);
        if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
        	if(results.status == 200){
        		
        		console.log("about results" + results);
        		res.render('loginCustomer');
        	}
        	else{
        		
        		res.end(results.message);
        	}
        }
    });
}

function loginCustomer(req,res){
	
	var email = req.param('email');
    var password = req.param('password');
    var msg_payload = {"email": email, "password" : password, "type": "loginCustomer"};
    
    mq_client.make_request('customer_queue', msg_payload, function(err,results) {
    	        
    	if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            if(results.status == 200){
            	
            	req.session.customer_id = results.customer_id;
            	console.log("Session started for :"+req.session.customer_id);
            	res.status(200).send("success");
            }
            else {
            	
            	res.status(404).send("Invalid User Name & Password! Please try again");
            }
        }
    });
}


function customerDashboard(req,res){
	res.render("customerDashboard");
}

function getDashboardSummary(req,res){
	
	var customer_id = req.session.customer_id;
	console.log("Retrieving dashboard for : "+customer_id);
	var msg_payload = {"customer_id" : customer_id, "type" : "customerDashboard"};
	
	mq_client.make_request('customer_queue', msg_payload, function(err,results) {
        
    	if (err) {
            console.log(err);
            res.send(err);
        } 
        else {
        	
            if(results.status == 200){
            	res.send(results.data);
            }
            else {
            	
            	res.status(404).send("Customer Dashboard Failed! Please try again");
            }
        }
    });
}

function getUserSensorList(req,res){
	
	var msg_payload = {customer_id  : req.session.customer_id};
	mq_client.make_request('usersensor_queue', msg_payload, function(err,results) {
	       
        if (err){
            console.log(err);
            res.send(err);
        } 
        else {
        	console.log("inside getUserSensorList else after getting proper resulds");
            if(results.status == 200){
            	console.log("result.data"+ results.data);
            	res.send(results.data);
            	
            }            
            else{
            	
            	//console.log("IN ELSE OF ADMIN LOGIN");
            	
            	res.status(404).send(" Invalid Usernam & Password! Please try again.");           	         	
            }
        }
    });
}



function subscribeSensor(req,res){
	var sensorDetails = req.body.sensor;
	var msg_payload = {sensorDetails  : sensorDetails , customer_id :  req.session.customer_id};
	mq_client.make_request('subscribesensor_queue', msg_payload, function(err,results) {
	       
        if (err){
            console.log(err);
            res.send(err);
        } 
        else { 
        	console.log("sensor subscribed");
           res.send(200);
        }
    });
}


function signOut(req, res){
	req.session.destroy();
	res.render('index');
}

exports.signOut=signOut;
exports.subscribeSensor=subscribeSensor;
exports.getUserSensorList=getUserSensorList;
exports.signup = signup;
exports.login = login;
exports.signupCustomer = signupCustomer;
exports.loginCustomer = loginCustomer;
exports.customerDashboard = customerDashboard;
exports.getDashboardSummary=getDashboardSummary; 