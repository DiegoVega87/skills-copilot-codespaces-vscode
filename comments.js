// Create web server and listen on port 8080 for connections
// Comments are stored in a file called comments.json
// Comments are read from the file and returned to the client
// Comments are added to the file when received from the client
// The comments are stored in an array of objects
// Each object has two properties: name and comment

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

// Create a server that invokes the request handler function
// for each incoming HTTP request
http.createServer(requestHandler).listen(8080);

// The request handler function is passed two arguments:
// 1. request - contains information about the HTTP request
// 2. response - used to return data back to the client
function requestHandler(request, response) {
    var url = request.url;
    var method = request.method;
    console.log('request: ' + request.url);

    if (url === '/') {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream('index.html').pipe(response);
    } else if (url === '/comments') {
        if (method === 'GET') {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            var readStream = fs.createReadStream('comments.json');
            readStream.pipe(response);
        } else if (method === 'POST') {
            var body = '';
            request.on('data', function(data) {
                body += data;
            });
            request.on('end', function() {
                var comment = qs.parse(body);
                console.log('comment: ' + JSON.stringify(comment));
                response.writeHead(200, { 'Content-Type': 'application/json' });
                fs.readFile('comments.json', function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        comments = JSON.parse(data);
                        comments.push(comment);
                        fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                response.end(JSON.stringify(comments));
                            }
                        });
                    }
                });
            });
        }
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        fs.createReadStream('404.html').pipe(response);
    }
}