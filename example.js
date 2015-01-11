var esClient = require('elasticsearch').Client();

require('./index')(esClient);
var start = new Date();
esClient.search({
  index: '*',
  body: {
    "query": {
      "bool": {
        "must": []
      }
    },
    "aggs": {
      "an_agg": {
        "terms": {
          "field": "foo",
          "size": 20
        }
      }
    }
  }
}, function (err, results) {
  var end = new Date();

  console.info('Took', end - start);
  process.exit(0);
});
