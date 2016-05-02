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


exports.handleRequest=handleRequest;