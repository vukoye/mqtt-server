'use strict';
var mosca = require('mosca')

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
    logger.info('client connected', client.id);
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    logger.info('Published', packet.payload);
    console.log('Published', packet.payload);
});

// fired when the mqtt broker is ready
function setup() {
    logger.info('Mosca embedded MQTT broker running now');
    console.log('Mosca embedded MQTT broker running now')
}
