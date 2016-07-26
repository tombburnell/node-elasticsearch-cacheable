var hash = require('object-hash'),
    Redis = require('redis'),
    _ = require('lodash');

var defaultConfig = {
  redisPort: 6379,
  redisHost: '127.0.0.1',
  redisDatabase: 0,
  cacheTime: 5 //seconds
}

function Mutate (client, options) {
  var config = _.extend(defaultConfig, options || {}),
      redis = Redis.createClient(config.redisPort, config.redisHost, config.redisOptions);

  redis.select(config.redisDatabase);

  client._search = client.search;

  client.search = function (params, cb) {
    if (params.noCache) {
      var noCache = true;
      delete params.noCache;
    }

    var hid = hash(params);

    if (noCache) {
      searchAndPersist(params, hid, cb);
    } else {
      redis.get(hid, function (err, data) {
        if (err) return cb(err);
        if (data) return cb(null, JSON.parse(data));

        searchAndPersist(params, hid, cb);
      });
    }
  };

  function searchAndPersist (params, hid, callback) {
    client._search(params, function (err, data) {
      if (err) return callback(err);

      setImmediate(function (){ return callback(err, data); });
      redis.set(hid, JSON.stringify(data), 'EX', config.cacheTime);
    });
  }
}

module.exports = Mutate
