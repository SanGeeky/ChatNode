var PORT = 33333;
var HOST = '10.20.69.82';

var dgram = require('dgram');
var message = new Buffer.from('My KungFu is Good!');

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);

});

client.on('message', function (answer, remote) {
    console.log(' ' + answer);

});
