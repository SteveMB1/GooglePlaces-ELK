const util = require('util'),
config = require('./config.json');
async = require('async'),
busy_hours = require('busy-hours'),
elasticsearch = require('elasticsearch'),
ES = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

//Get the weekday as a number (0-6)
var d = new Date();
dayArr = d.getDay();

ES.count({ index: config.ELK_INDEX_NAME }, function (count_error, count_response) {
	if ( count_response.error ) {
		id_numb = 1;
		} else {
			id_numb = (count_response.count) + (1);
	};
		});

async.each(config.LOCATIONS,function(data,err) {
console.log(data.gid)
	const toES = async () => {
		await	busy_hours( data.gid, config.GOOGLE_API_KEY ).then(data => {
		ES.create({
			index: config.ELK_INDEX_NAME,
			type: 'string',
			id: id_numb,
			body: {
				title: data.title,
				day: data.week[dayArr].day,
				hours: data.week[dayArr].hours,
				'@timestamp': new Date().toISOString()
			}
			}, 
			function (error, response) { console.log( "" + util.inspect(response,error, {showHidden: false, depth: null}) + "" );
				id_numb++;
				console.log(id_numb); 
			});
		});
	};
	toES();
});
