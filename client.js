var PORT = 33333;  										///Definimos el puerto por donde vamos a transmitir nuestro socket
var HOST = '127.0.0.1';									/// Direccion IP del servidor

var dgram = require('dgram');							///Solicita un modulo de datagarama


var client = dgram.createSocket('udp4');				////Creación de socket del cliente 

function Command() {

	process.stdin.on('data', function(frase) {                       ///Habilita la entrada de datos en la terminal

		var message = frase.toString().replace(/\n|\n/g, '');		/// Se almacena el mensaje

		var buffer  = new Buffer(message);							/// Se guarda el mensaje en un Buffer para ser enviado
		if( message == "exit")
		{
			console.log("\n \nHa salido del Chat ")					/// Si el mensaje es exit se cierra la consola y se solicita la salida en el server
			console.log("/*/*/*/*Hasta Pronto/*/*/*/*/");
			client.send(buffer, 0, buffer.length, PORT, HOST, function(err, bytes) {
				if (err) throw err;
				client.close();
				process.exit();
			});
			
		}
		else
		{
	 		client.send(buffer, 0, buffer.length, PORT, HOST);   //// Se envia el mensaje en el buffer a traves de los puerto y direcciones establecidas anteriormente
		}
	});

}

client.bind();
client.on('listening', function() {          //// Se habilita la conexion con el server

	var buffer = new Buffer("\n");

	console.log('Cliente conectado al puerto %d.', client.address().port);
	console.log('(Escriba "exit" para terminar)');
	client.send(buffer, 0, buffer.length, PORT, HOST);
    //Aqui envia un JSON por la direccion sumistrada en server
});


client.on('message', function (answer) {    //Cliente escucha y recibe un mensaje
    console.log(' ' + answer);
});


process.stdin.resume();
Command();
