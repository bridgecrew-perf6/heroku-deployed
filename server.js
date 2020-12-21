
const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 8080);
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/myapp'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/myapp/index.html'));
});

// Start the app by listening on the default Heroku port

app.listen(process.env.PORT || 8080,function() {
  console.log('localhost:' + app.get('port'))
});
