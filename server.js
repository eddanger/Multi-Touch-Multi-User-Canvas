require.paths.unshift('./node_modules')

var express = require('express');
var app = module.exports = express.createServer();
var port = 8080;

app.configure(function() {
  // app configuration
  app.use(express.logger());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: "multi touch multi user canvas" }));
  app.use(express.static(__dirname + '/public'));
});

require('./canvas_socket');
require('./main');

app.listen(port);

console.log('Ready for art on port ' + port );