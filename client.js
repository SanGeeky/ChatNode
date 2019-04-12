var PORT = 33333;
var HOST = '127.0.0.1';

var dgram = require('dgram');


//var message = new Buffer.from('My KungFu is Good!');

var client = dgram.createSocket('udp4');

function Command() {

	process.stdin.on('data', function(chunk) {

		var message = chunk.toString().replace(/\n|\n/g, '');

		var buffer  = new Buffer(message);
	 	// client.send(buffer, 0, buffer.length, PORT, HOST);
		if( message == "exit")
		{
			console.log("\n \nHa salido del Chat ")
			console.log("Presione ctrl+C");
			client.send(buffer, 0, buffer.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				client.close();
			});
			
		}
		else
		{
	 		client.send(buffer, 0, buffer.length, PORT, HOST);
		}
		//var object  = message;
	});

}



// client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
//     if (err) throw err;
//     console.log('UDP message sent to ' + HOST +':'+ PORT);

// });

client.bind();
client.on('listening', function() {

	var buffer = new Buffer("\n");

	console.log('Cliente conectado al puerto %d.', client.address().port);
	console.log('(Escriba "Exit" para terminar)');
	client.send(buffer, 0, buffer.length, PORT, HOST);
    //Aqui envia un JSON por la direccion sumistrada en server
});


client.on('message', function (answer) {
    console.log(' ' +answer);
});


process.stdin.resume();
Command();


////Mostrar mensaje de bienvenida
// client.bind();
// client.on('listening', function() {

// 	var buffer = new Buffer("\n");

// 	console.log('Cliente conectado al puerto %d.', client.address().port);
// 	console.log('(Escriba "Exit" para terminar)');
// 	client.send(buffer, 0, buffer.length, PORT, HOST);
//     //Aqui envia un JSON por la direccion sumistrada en server
// });