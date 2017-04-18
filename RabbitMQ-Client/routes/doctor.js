/**
 * http://usejsdoc.org/
 */
var ejs = require('ejs');
var mq_client = require('../rpc/client');

function login(req,res){
	
	if(req.session.doctor_id){
		
		res.render("doctorDashboard");
	}
	else{
		
		res.render("doctorlogin");
	}
}

function logindoctor(req,res){
	
	var email = req.param('email');
	var password = req.param('password');
	
	var msg_payload = {"email": email, "password" : password, "type": "loginDoctor"};
	
	mq_client.make_request('doctor_queue', msg_payload, function(err,results) {
       
        if (err){
            console.log(err);
            res.send(err);
        } 
        else {
        	
            if(results.status == 200){
            	
            	console.log("IN IF OF DOCTOR LOGIN");
            	req.session.doctor_id = results.doctor_id;
            	res.status(200).send("success");
            	
            }            
            else{
            	
            	console.log("IN ELSE OF DOCTOR LOGIN");
            	
            	res.status(404).send(" Invalid Usernam & Password! Please try again.");           	         	
            }
        }
    });
	
	
}

function getDoctorDashboard(req,res){
	res.render("doctorDashboard");
}

exports.getDoctorDashboard=getDoctorDashboard
exports.login = login;
exports.logindoctor = logindoctor;