var http = require("http");
var request = require('request'); // make an HTTP GET request to the url
var stats = require('stats-analysis');
var plotly = require('plotly')("281team16", "hvebdout2z");
var plotUrl;

function getSensorData(req,res){
	var sensor = req.query.sensor;
	console.log(sensor);
	sensor = JSON.parse(sensor);
	console.log("sensorid : "+sensor.sensorid)
	var lat, lon, location, data, sum = 0, len, arr = [], mean, standardDeviation, median;
	 var sensor_id = sensor.sensorid;
	 var sensor_type = sensor.sensortype.toLowerCase();
	 console.log("sensortype : "+sensor_type);
	 //var type_range = "&wind_speed>=1&wind_speed<=1.5";
	 var range_min;   		// range_min: &wind_speed>=1
	var range_max;			// range_max: &wind_speed<=1.5
	
	 switch(sensor_id){
		case 1: // Oakland
			this.location = 'edu_utah_mesowest_c6723.json?';
			range_min = 10;
			range_max = 110;			
			break;

		case 2: // San Francisco
			this.location = 'noaa_nos_co_ops_9414290.json?';
			range_min = 1;
			range_max = 1.5;
			break;
		
		case 3: // Santa Cruz
			this.location = 'edu_utah_mesowest_c8539.json?';
			break;
	}
	 
	 function getTime(date) {
			
		    var year = date.getFullYear();

		    var month = date.getMonth() + 1;
		    month = (month < 10 ? "0" : "") + month;

		    var day  = date.getDate();
		    day = (day < 10 ? "0" : "") + day;
		    
		    var hour = date.getHours();
		    hour = (hour < 10 ? "0" : "") + hour;

		    var min  = date.getMinutes();
		    min = (min < 10 ? "0" : "") + min;

		    var sec  = date.getSeconds();
		    sec = (sec < 10 ? "0" : "") + sec;

		    return year + "-" + month + "-" + day + "T" + hour + ":" + min + ":" + sec + "Z";
		    
		};
		
		function getAWeekAgo(date){
			date.setDate(date.getDate()-7);
			return getTime(date);
		};
		
		var date = new Date();
		global.curTime = getTime(date);
		console.log("current time: ", curTime);

		global.aWeekAgo = getAWeekAgo(date);
		console.log("a week ago: ", aWeekAgo);
		
	 
	 
	 /*var url = 'http://erddap.cencoos.org/erddap/tabledap/' + this.location + 'time,latitude,longitude,station,' +
	 sensor_type + '&time>=2016-04-22T00:00:00Z&time<=2016-04-29T23:16:00Z' + type_range;
	 */
	 var url = 'http://erddap.cencoos.org/erddap/tabledap/' + this.location + 'time,latitude,longitude,station,' +
	  sensor_type + '&time>=' + aWeekAgo +'&time<=' + curTime + '&' + 
	  sensor_type + ">=" + range_min + '&' + sensor_type + "<=" + range_max;

	console.log("url is :"+url);
	
	
request(url, function (error, response, body) {
	 
		
		// helper function to check if the JSON file is empty
		function isJSONEmpty(obj){
			return Object.keys(obj).length <= 0;
		}
		
		// alert the users when the JSON file is empty
		if (isJSONEmpty(body)){
			console.log("Sorry! This sensor does not exist!");
		}
	  
		if (error){
			console.log("Sorry, your query produced no matching result!");
		}	
		
		// helper function to check if the JSON file is empty
		function isJSONEmpty(obj){
			return Object.keys(obj).length <= 0;
		}
		
		// alert the users when the JSON file is empty
		if (isJSONEmpty(body)){
			console.log("Sorry, your query produced no matching result!");
		}
	  
		if (!error && response.statusCode === 200) {
			//console.log(body);
			
			// define a JSON type
			var jsonContent = JSON.parse(body);

			// get values from JSON
			var jsonArray = jsonContent.table.rows;
			len = Object.keys(jsonArray).length;
			
			var i = 0;
			for (; i < len; i++){
				lat = jsonContent.table.rows[i][1];
				lon = jsonContent.table.rows[i][2];
				location = jsonContent.table.rows[i][3];
				data = jsonContent.table.rows[i][4];
				arr.push(data);
			}
			
			// statistics
			mean = stats.mean(arr).toFixed(4);
			median = stats.median(arr);
			standardDeviation = stats.stdev(arr).toFixed(4);
			
			// box-plot
			var boxPlotData = [
			            {
			              y: arr,
			              boxpoints: "all",
			              jitter: 0.3,
			              pointpos: -1.8,
			              type: "box"
			            }
			          ];
			
			var graphOptions = {filename: "box-plot-jitter", fileopt: "overwrite"};
			plotly.plot(boxPlotData, graphOptions, function (err, msg) {
			    console.log("message : "+msg);
			    console.log("message url : "+msg.url);
				var jsonResponses ={mean:mean, median:median, standardDeviation:standardDeviation, plot:msg.url};
				console.log(jsonResponses);
				res.send(jsonResponses);
			});
			
	  }
	});	
}

exports.getSensorData=getSensorData;