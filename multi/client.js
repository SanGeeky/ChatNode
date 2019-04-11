var dgram  = require('dgram'),
	server = {
		host: 'localhost',
		port: 3000
	};

function Command() {

	process.stdin.on('data', function(chunk) {

		var message = chunk.toString().replace(/\n|\n/g, '');

		if (message === 'exit') {
			var object  = '{"type":"disconnect"}';
			console.log('Appuyez sur "Ctrl + C" pour terminer.');
		} else {
			var object  = '{"type":"message","message":"'+message+'"}';
		}

	 	var buffer  = new Buffer(object);
	 	client.send(buffer, 0, buffer.length, server.port, server.host);

	});

}

var client = dgram.createSocket('udp4', function(message, rinfo) {
	
	console.log('%s', message.toString());
	process.stdin.resume();

	process.stdin.removeAllListeners('data');
	process.stdin.on('data', function(chunk) {
	 	Command();
	});

});

client.bind();

client.on('listening', function() {

	var buffer = new Buffer('{"type":"connect"}');

	console.log('Cliente conectado al puerto %d.', client.address().port);
	console.log('(Escriba "Exit" para terminar)');
	client.send(buffer, 0, buffer.length, server.port, server.host);
    //Aqui envia un JSON por la direccion sumistrada en server
});

client.on('error', function(err) {
	console.log(err);
});

client.on('close', function() {

	var buffer = new Buffer('{"type":"disconnect"}');

	console.log('Client déconnecté.', client.address().port);
    client.send(buffer, 0, buffer.length, server.port, server.host);
    client.close();
    //Aqui se dice que lo saquen
})

process.stdin.resume();
Command();
