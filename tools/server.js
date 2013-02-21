var http = require('http');
var fs = require('fs');
var path = require('path');
var fs = require('fs');
 
http.createServer(function (request, response) {
 
     
    var filePath = '..' + request.url;
    if (filePath == './')
        filePath = './index.htm';
         
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break; 
        case '.png':
            contentType = 'image/png';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
	console.log("request for",filePath);
	
	//https://github.com/donofkarma/node-ssi-parser/blob/master/lib/node-ssi-parser.js
	function ssi(parsed,filePath) {
		parsed = parsed.toString().replace(/<!--#include file="(.*?)"-->/g, function(match,includePath) {
			var output;
			var newFilePath = path.dirname(filePath) + "/" + includePath;
			console.log(newFilePath);
			var contents = fs.readFileSync(newFilePath, 'utf8');
			output = ssi(contents,newFilePath);
			return output;
		});
		return parsed;
	}
	
    fs.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
					if (contentType == "image/png") {
					   response.end(content);
					} else {
                       response.end(ssi(content,filePath), 'utf-8');
					}
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
     
}).listen(8080);
 
console.log('Server running at http://127.0.0.1:8080/');