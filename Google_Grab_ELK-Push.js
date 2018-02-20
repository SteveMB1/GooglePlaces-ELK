const util = require('util'),
async = require('async'),
busy_hours = require('busy-hours'),
elasticsearch = require('elasticsearch'),
ES = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});

GOOGLE_API_KEY = ''
GOOGLE LOCATION_ID = ''
ELK_INDEX_NAME = ''

//Get the weekday as a number (0-6)
var d = new Date();
dayArr = d.getDay();

const toES = async () => {
	await	busy_hours(GOOGLE_LOCATION_ID, GOOGLE_API_KEY).then(data => {
	ES.count({ index: ELK_INDEX_NAME }, function (count_error, count_response) {
		if ( count_response.error ) {
			id_numb = 1;
			} else {
				id_numb = (count_response.count) + (1);
		};
	ES.create({
		index: 'competition',
		type: 'string',
		id: id_numb,
		body: {
			title: 'Comp',
			published: true,
			day: data.week[dayArr].day,
			hours: data.week[dayArr].hours,
			'@timestamp': new Date().toISOString()
		}
		}, function (error, response) { console.log( "" + util.inspect(response,error, {showHidden: false, depth: null}) + "" ) });
	});
	});
};
toES()
