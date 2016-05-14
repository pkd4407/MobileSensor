var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , customer = require('./routes/customer')
  , sensor = require('./routes/sensorData')
  , admin = require('./routes/admin')
  , path = require('path');

//URL for the sessions collections in mongoDB
//var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
//var mongoStore = require("connect-mongo")(expressSession);
//var mongo = require("./routes/mongo");


var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(expressSession({   
	  
	cookieName: 'session',    
	secret: 'cmpe281_mobilesensor',    
	duration: 30 * 60 * 1000,    //setting the time for active session
	activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently


app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Get requests
app.get('/', routes.index);
app.get('/loginAdmin',admin.login);
app.get('/signupCustomer',customer.signup);
app.get('/loginCustomerPage',customer.login);
app.get('/customerDashboard',customer.customerDashboard);
app.get('/getDashboardSummary',customer.getDashboardSummary);
app.get('/getSensorList', admin.getSensorList);
app.get('/getUserSensorList', customer.getUserSensorList);
app.get('/getSensorData', sensor.getSensorData);
app.get('/adminDashboard', admin.getAdminDashboard);

//post requests
app.post('/loginAdmin',admin.loginadmin);
app.post('/signupCustomer',customer.signupCustomer);
app.post('/loginCustomer',customer.loginCustomer);
app.post('/subscribeSensor',customer.subscribeSensor);
app.post('/adminAddSensor',admin.adminAddSensor);

//connect to the mongo collection session and then createServer
http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

