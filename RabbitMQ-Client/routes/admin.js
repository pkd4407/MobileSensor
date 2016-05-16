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

function getSensorList(req, res){
	console.log("inside getSensorList");
	var msg_payload = {};
	mq_client.make_request('sensor_queue', msg_payload, function(err,results) {
	       
        if (err){
            console.log(err);
            res.send(err);
        } 
        else {
        	console.log("inside getSensorList else after getting proper resulds");
            if(results.status == 200){
            	console.log("result.data"+ results.data);
            	res.send(results.data);
            	
            }            
            else{
            	
            	console.log("IN ELSE OF ADMIN LOGIN");
            	
            	res.status(404).send(" Invalid Usernam & Password! Please try again.");           	         	
            }
        }
    });
	
}

function adminAddSensor(req,res){
	
	var sensor_id = req.body.sensorid;
	var sensor_name = req.body.sensorname;
	var sensor_type = req.body.sensortype;
	var sensor_location = req.body.location;
	var manufacturer = req.body.manufacturer;
	var sensortypealias ="";
	
	if(sensor_type = "temperature"){
		
		sensor_type = "air_temperature";
		sensortypealias = "Temperature"
	}
	else if(sensor_type = "windspeed"){
		
		sensor_type = "wind_speed";
		sensortypealias = "Wind Speed";
	}
	else{
		sensor_type = "wind_from_direction";
		sensortypealias = "Wind Direction";
	}
	
    console.log("manu :"+manufacturer);
	var msg_payload = {"sensor_id": sensor_id, "sensor_name" : sensor_name, "sensor_type" : sensor_type, "sensor_location" : sensor_location,"manufacturer" :manufacturer,"sensortypealias" :sensortypealias};
	
	mq_client.make_request('addAdminSensor_queue', msg_payload, function(err,results) { 
		
		if (err){
            console.log(err);
            res.send(err);
        } 
        else {
            if(results.status == 200){
            	console.log("result.data"+ results.data);
            	res.send(results.data);
            	
            }
            else{
            	
            	console.log("IN ELSE OF ADMIN Add Sensor");
            	
            	res.status(404).send(" Something went wrong.");           	         	
            }
        }
		
	});
	
}

function getAdminDashboard(req,res){
	res.render("adminDashboard");
}

exports.adminAddSensor=adminAddSensor
exports.getAdminDashboard=getAdminDashboard
exports.getSensorList = getSensorList;
exports.login = login;
exports.loginadmin = loginadmin;