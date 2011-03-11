var app = module.parent.exports;

app.get('/', function(req, res) {
  res.render('index.jade');
});
