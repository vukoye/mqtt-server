'use strict';
var mosca = require('mosca')


// We’re setting up an extremely simple server here.
const http = require('http');

// These could (should) be set as env vars.
const port = process.env.PORT || 5000;
const host = process.env.HOST || 'localhost';

// No matter what hits the server, we send the same thing.
http.createServer((req, res) => {

  // Tell the browser what’s coming.
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });

  // Send a simple message in HTML.
  res.write('<h1>I’m a Node app!</h1>');
  res.write('<p>And I’m <em>sooooo</em> secure.</p>');
  res.end();
}).listen(port, host);


var SECURE_KEY = __dirname + '/newkey.pem';
var SECURE_CERT = __dirname + '/cert.pem';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}



var settings = {
    port: 1883,
    logger: {
        name: "secureSample",
        level: 40,
    },
    secure : {
        port: 7998,
        keyPath: SECURE_KEY,
        certPath: SECURE_CERT,
    }
};
var server = new mosca.Server(settings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
    logger.info('Hello again distributed logs');
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    logger.info('Hello again distributed logs');
    console.log('Published', packet.payload);
});

// fired when the mqtt broker is ready
function setup() {
    logger.info('Hello again distributed logs');
    console.log('Mosca embedded MQTT broker running now')
}
