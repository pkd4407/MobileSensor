/**
 * http://usejsdoc.org/
 */
var mysql = require('./mysql');

function handleRequest(msg,callback){
	
	switch(msg.type)
	{
		case "loginAdmin":
			loginadmin(msg,callback);
			break;
	}
}

function loginadmin(msg,callback){
	
	var email = msg.email;
	var password = msg.password;
	var response;
	console.log(email + ' ' +password);
	var sqlQuery = "select * from admin where email = '" + email + "' and password = '" + password + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				response =({status:500, message: "Admin! Login failed" });
				callback(null,response);
			}
			else{
				
				console.log("login admin data from MYSQL " + JSON.stringify(result));
				if(result.length > 0){
					
					console.log("ADMIN DATA RETRIEVED AT LOGIN: " + JSON.stringify(result));					
					
						response =({status:200, message: "Admin! Login Successful", admin_id: result[0].admin_id});						
						callback(null,response);
				}
				else{
					
					console.log("in outer else");
					response =({status:500, message: "Admin! Login failed" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}	


function getSensorList(msg,callback){
	console.log("inside getSensorList");
	var sqlQuery = "select * from sensordetails";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				response =({status:500, message: "Admin! SensorList failed" });
				callback(null,response);
			}
			else{
				
				console.log("querying db for sensorlist");
				if(result.length > 0){
					console.log("results :" +result);
					//console.log("ADMIN DATA RETRIEVED AT LOGIN: " + JSON.stringify(result));					
					
						response =({status:200, message: "sensor data received", data:result});						
						callback(null,response);
				}
				else{
					
					console.log("in outer else");
					response =({status:500, message: "sensor data not received" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}


function addAdminSensor(msg,callback){
	
	var sensor_id = msg.sensor_id;
	var sensor_name = msg.sensor_name;
	var sensor_type = msg.sensor_type;
	var sensor_location = msg.sensor_location;
	var manufacturer = msg.manufacturer;
	var sensortypealias = msg.sensortypealias;
	
	var response;
	
	var sqlQuery = "INSERT INTO sensordetails  (sensorid , sensorname, sensortype, location,manufacturer,sensortypealias) VALUES ('"+sensor_id+"','"+sensor_name+"','"+sensor_type+"','"+sensor_location+"','"+manufacturer+"','"+sensortypealias+"')";

	mysql.fetchData(function(err,result){
		
		if(err){ 
			
			response =({status:500, message: "Add Sensor failed" });
			callback(null,response);
		}
		else{
			response =({status:200, message: "Add sensor Succesful", data:result});						
			callback(null,response);
		}
 },sqlQuery);
	
}

exports.addAdminSensor=addAdminSensor;
exports.getSensorList=getSensorList;
exports.handleRequest=handleRequest;