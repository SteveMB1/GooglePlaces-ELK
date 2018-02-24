const util = require('util'),
  config = require('./config.json'),
  async = require('async'),
  busy_hours = require('busy-hours'),
  elasticsearch = require('elasticsearch'),
  ES = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

//day-of-week as integer (0-6)
const d = new Date(),
  dayArr = d.getDay();

function uploadKibana(count) {
  async.each(config.LOCATIONS, function(data, err) {
    var toES = async () => {
      await busy_hours(data.gid, config.GOOGLE_API_KEY).then(data => {
      console.log('BIG COUNT: '+count);
        ES.create({
            index: config.ELK_INDEX_NAME,
            type: 'string',
            id: count,
            body: {
              title: data.title,
              day: data.week[dayArr].day,
              hours: data.week[dayArr].hours,
              '@timestamp': new Date().toISOString()
            }
          },
          function(error, response) {
            console.log("" + util.inspect(response, error, {
              showHidden: false,
              depth: null
            }) + "");
            count++;
            console.log("Elasticsearch ID Count: " + count);
          });
      });
    };
    toES();
  });
};

ES.count({ index: config.ELK_INDEX_NAME }, function(count_error, count_response) {
  console.log("Data from count: " + util.inspect(count_response, count_error, {
    showHidden: false,
    depth: null
  }) + "");
  if (count_response.error) {
    var id_numb = 2;
  } else {
    var id_numb = (count_response.count) + (1);
  };
  console.log("Within function: " + id_numb)
  uploadKibana(id_numb)
});
