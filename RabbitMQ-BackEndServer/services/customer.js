
var mysql = require('./mysql');

function handleRequest(msg,callback){
	
	switch(msg.type)
	{
		case "signupCustomer":
			console.log("inside server 1");
			signupcustomer(msg,callback);
			break;
		case "loginCustomer":
			logincustomer(msg,callback);
			break;
		case "customerDashboard":
			customerdashboard(msg,callback);
			break;
	}
}

function signupcustomer(msg,callback){
	
	console.log("inside server signup");
	
	//var customer_id = msg.customer_id;
	var email = msg.email;
	var password = msg.password;
	var response;
	
	var sqlQuery = "INSERT INTO customer (email, password) VALUES (" + 
    				"'" + email + "'," +
    				"'" + password + "')";
	
	mysql.fetchData(function(err,result){
		
		if(err){ 
    		
    		response =({status:500,message: "Customer! Registeration failed" });
    		console.log("SYSTEM ERROR in customer registration");
    		callback(null,response);
    		
    	}
		else {
        	
            response = ({status:200,message: "CUSTOMER! Registeration Succesful" });
            console.log("CUSTOMER INSERTED TO MYSQL");
            callback(null,response);
		}
	},sqlQuery);
}

function logincustomer(msg,callback){
	
	var email = msg.email;
	var password = msg.password;
	var response;
	console.log(email + ' ' +password);
	var sqlQuery = "select * from customer where email = '" + email + "' and password = '" + password + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				response =({status:500, message: "Customer! Login failed" });
				callback(null,response);
			}
			else{
				
				console.log("login admin data from MYSQL " + JSON.stringify(result));
				if(result.length > 0){
					
					console.log("CUSTOMER DATA RETRIEVED AT LOGIN: " + JSON.stringify(result));					
					
						response =({status:200, message: "Customer! Login Successful", customer_id: result[0].customer_id});						
						callback(null,response);
				}
				else{
					
					console.log("in outer else");
					response =({status:500, message: "Customer! Login failed" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}

function customerdashboard(msg,callback){
	
	var customer_id = msg.customer_id;
	var response;
	
	sqlQuery = "select count(*) AS configCount from sensorconfiguration where customer_id = '"+customer_id+"'";
	
	mysql.fetchData(function(err,result){
		
		if(err){ 
			
			response =({status:500, message: "Dashboard failed" });
			callback(null,response);
		}
		else{
			
			if(result.length > 0){
				var configCount = result;
				sensorQuery = "select count(*) AS sensorcount from sensordetails";
				mysql.fetchData(function(err,result){
					
					if(err){ 
						
						response =({status:500, message: "Dashboard failed" });
						callback(null,response);
					}
					else{
						
						if(result.length > 0){
							//var configCount = result;
							//sensorQuery = "select count(*) from sensordetails";
							
							
							console.log("Sensor count RETRIEVED: " + JSON.stringify(result));					
							var data = {configCount: configCount, sensorcount:result};
								response =({status:200, message: "Dashboard Successful", data:data });						
								callback(null,response);
						}
						else{
							
							console.log("in outer else");
							response =({status:500, message: "Dashboard failed" });
							callback(null,response);
						}
						
					}
					
				},sensorQuery);
			}
			else{
				
				console.log("in outer else");
				response =({status:500, message: "Dashboard failed" });
				callback(null,response);
			}
			
		}
		
	},sqlQuery);
}

exports.signupcustomer=signupcustomer;
exports.logincustomer=logincustomer;
exports.customerdashboard=customerdashboard;
exports.handleRequest=handleRequest;