/**
 * http://usejsdoc.org/
 */

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
	
	if(req.session.customer_id){
		
		res.render("customerDashboard");
	}
	else{
		
		res.render("loginCustomer");
	}
}

function signupCustomer(req,res){
	
	console.log("inside 1");
	var customer_id = req.param('email');
	var email 	 = req.param('email');
	var password = req.param('password');
	
	console.log("inside");
	var msg_payload = { "customer_id" : customer_id, "email" : email, "password" : password, "type" : "signupCustomer" };
	
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
            	res.status(200).send("success");
            }
            else {
            	
            	res.status(404).send("Invalid User Name & Password! Please try again");
            }
        }
    });
}

//function getsensors(req,res){
//	
//	var customer_id = req.session.customer_id;
//	var msg_payload = {"customer_id" : customer_id, "type" : "getsensors"};
//	
//	mq_client.make_request('customer_queue', msg_payload, function(err,results) {
//        
//    	if (err) {
//            console.log(err);
//            res.send(err);
//        } 
//        else {
//        	
//            if(results.status == 200){
//            	res.status(200).send("success");
//            }
//            else {
//            	
//            	res.status(404).send("Invalid User Name & Password! Please try again");
//            }
//        }
//    });
//}
	


exports.signup = signup;
exports.login = login;
exports.signupCustomer = signupCustomer;
exports.loginCustomer = loginCustomer;