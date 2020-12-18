//Install express server
const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3000);
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/RecordRTCProject'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/RecordRTCProject/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 3000,function() {
  console.log('localhost:' + app.get('port'));
});
