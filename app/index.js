var mosca = require('mosca')

var SECURE_KEY = __dirname + '/newkey.pem';
var SECURE_CERT = __dirname + '/cert.pem';

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
    console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
    console.log('Published', packet.payload);
});

// fired when the mqtt broker is ready
function setup() {
    console.log('Mosca embedded MQTT broker running now')
}
