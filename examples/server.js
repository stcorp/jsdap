var path = require('path');

//Required for setting up a proxy
var express = require('express');
var request = require('request');

var app = new express();
var port = 3000;

app.use(express.static('examples'));

//Proxy for accessing data
app.use('/proxy', function(req, res) {
    var url = req.query['url'];

    req.pipe(request(url)).pipe(res);
});

app.listen(port, function(error) {
    if (error) {
        console.error(error);
    }
    else {
        console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
    }
});
