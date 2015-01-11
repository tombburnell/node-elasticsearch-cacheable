# node-elasticsearch-cacheable

Modifies the official elasticsearch-js client to add caching in redis.
In my tests its been anywhere from 12% to 4% of a response from elasticsearch.

##Getting Started
Install:
```
npm install elasticsearch-cacheable
```

Create an elasticsearch client, mutate it with this module and use away:
```javascript
var esClient = require('elasticsearch').Client();
require('./elasticsearch-cacheable')(esClient);

esClient.search({
  ...
}, function (err, results) {
  ...
});
```

##Options
When mutating, there is a default config as such:
```javascript
{
  redisPort: 6379,
  redisHost: '127.0.0.1',
  redisDatabase: 0,
  cacheTime: 5 //seconds
}
```
Which is changed like so:

```javascript
var esClient = require('elasticsearch').Client();
require('./elasticsearch-cacheable')(esClient, {
  redisHost: '10.10.10.10',
  cacheTime: 3
});
```

Also any time you wish to bust the cache and force a search against elasticsearch, just add ```noCache: true``` to the search parameters:

```javascript
esClient.search({
  index: '*',
  type: 'foo',
  noCache: true,
  body: {
    "query": {
      ...
  }
}, function (err, results) {
  ...
}
```
