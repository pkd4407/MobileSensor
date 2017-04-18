var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , customer = require('./routes/customer')
  , sensor = require('./routes/sensorData')
  , doctor = require('./routes/doctor')
  , path = require('path');


var expressSession = require("express-session");

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
	secret: 'cmpe295B',    
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
app.get('/loginDoctor',doctor.login);
app.get('/doctorDashboard', doctor.getDoctorDashboard);
app.get('/signupCustomer',customer.signup);
app.get('/loginCustomerPage',customer.login);
app.get('/customerDashboard',customer.customerDashboard);
app.get('/getDashboardSummary',customer.getDashboardSummary);
app.get('/signOut', customer.signOut);

//post requests
app.post('/loginDoctor',doctor.logindoctor);
app.post('/signupCustomer',customer.signupCustomer);
app.post('/loginCustomer',customer.loginCustomer);

//createServer
http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});

