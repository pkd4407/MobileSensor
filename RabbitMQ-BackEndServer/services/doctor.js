/**
 * http://usejsdoc.org/
 */
var mysql = require('./mysql');

function handleRequest(msg,callback){
	
	switch(msg.type)
	{
		case "loginDoctor":
			logindoctor(msg,callback);
			break;
	}
}

function logindoctor(msg,callback){
	
	var email = msg.email;
	var password = msg.password;
	var response;
	console.log(email + ' ' +password);
	var sqlQuery = "select * from doctor where email = '" + email + "' and password = '" + password + "'";
	
	mysql.fetchData(function(err,result){
		
			if(err){ 
				
				response =({status:500, message: "Doctor! Login failed" });
				callback(null,response);
			}
			else{
				
				console.log("login doctor data from MYSQL " + JSON.stringify(result));
				if(result.length > 0){
					
					console.log("DCOTOR DATA RETRIEVED AT LOGIN: " + JSON.stringify(result));					
					
						response =({status:200, message: "Docotr! Login Successful", doctor_id: result[0].doctor_id});						
						callback(null,response);
				}
				else{
					
					console.log("in outer else");
					response =({status:500, message: "Doctor! Login failed" });
					callback(null,response);
				}
			}
	 },sqlQuery);
}	

exports.handleRequest=handleRequest;