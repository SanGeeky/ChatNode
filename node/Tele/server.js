var PORT = 33333;
var HOST = '10.20.69.82';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var answer = new Buffer.from('Hola amikoooslkfffffffsadfasdf');
var remotePORT ;
var remoteHOST ;

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    remoteHOST=remote.address;
    remotePORT=remote.port;
    server.send(answer, 0, answer.length, remotePORT, remoteHOST , function(err, bytes){
      if (err) throw err;
      //console.log('Mensaje recibido /*/**/*/*/*/*/*/' + answer);
    });
});




server.bind(PORT, HOST);
