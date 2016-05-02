/**
 * http://usejsdoc.org/
 */
var ejs = require('ejs');
var mq_client = require('../rpc/client');

function login(req,res){
	
	if(req.session.admin_id){
		
		res.render("adminDashboard");
	}
	else{
		
		res.render("adminlogin");
	}
}

function loginadmin(req,res){
	
	var email = req.param('email');
	var password = req.param('password');
	
	var msg_payload = {"email": email, "password" : password, "type": "loginAdmin"};
	
	mq_client.make_request('admin_queue', msg_payload, function(err,results) {
       
        if (err){
            console.log(err);
            res.send(err);
        } 
        else {
        	
            if(results.status == 200){
            	
            	console.log("IN IF OF ADMIN LOGIN");
            	req.session.admin_id = results.admin_id;
            	res.status(200).send("success");
            	
            }            
            else{
            	
            	console.log("IN ELSE OF ADMIN LOGIN");
            	
            	res.status(404).send(" Invalid Usernam & Password! Please try again.");           	         	
            }
        }
    });
	
	
}



exports.login = login;
exports.loginadmin = loginadmin;