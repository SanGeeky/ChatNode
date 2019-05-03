var PORT = 33333;                      ///Puerto de Transmision   
var HOST = '127.0.0.1';                /// Direccion IP del servidor

var clients = [];                       /// Array de lista de Clientes conectados
var clientPort =[];                     /// Array de Puertos de los clientes conectados
var objectToSave = [];                  /// Array de Historial de Chat

var dgram = require('dgram');           ///Solicita Modulo de Datagrama
var util = require('util');              /// El modulo Util es usado para dar formato al texto
var server = dgram.createSocket('udp4');   ///Creacion del Socket Server


server.on('listening', function () {       /// El servidor se inicia y escucha solicitudes
    var address = server.address();
    console.log(' Servidor UDP esuchando en ' + address.address + ":" + address.port);
});

function NewConection(remote)      /// Funcion para agregar cliente
{
  clients.push(remote);           /// Se añade al array  su inforamacion del datagrama
  clientPort.push(remote.port);   /// Se añade al array el puerto del cliente por el cual se transmitira el mensaje

  var answer = util.format("\nNueva conexion de cliente: [" + remote.address+':'+remote.port+"]");
  Broadcast(answer,remote)        /// Se informa a los demas usuarios sobre el nuevo cliente
  console.log(answer);
}

function DeleteConection(remote)    /// Funcion para desconectar Cliente
{
  var answer = util.format("Desconexion de: " + "<" + remote.address + ':' + remote.port + ">");
  Broadcast(answer,remote)           //// Se informa a los demas clientes de la salida del cliente
  console.log(answer);

  clients.splice(clients.indexOf(remote), 1)  /// Se elimina del array los datos del cliente (datagram)
  clientPort.splice(clientPort.indexOf(remote.port), 1)
}

function Broadcast(message, remote)   /// Funcion para retransmitir el mensaje a los demas clientes
{
  var answer = new Buffer(message);   /// Se almacena en un buffer el mensaje
  
  Save(message);                      /// se lllama a la funcion para guardar el chat
  
  clients.forEach(function(client) {  /// Se retransmite el mensaje cliente por cliente
    
    if (clientPort.includes(remote.port) && client.port != remote.port ) {  /// Se verifica que exista el cliente y que no se reenvie el mensaje al cliente que se envio
      server.send(answer, 0, answer.length, client.port, client.address);
    }
  });
}

function Save(message)
{
  const fs = require('fs');    /// se almacena en un array el historial y se guarda en un archivo tipo JSON
 
  objectToSave.push(message)

  fs.writeFile('historial.json', JSON.stringify(objectToSave),'utf8', (err) => {
    if (err) throw err;
    //console.log('The file has been saved!');
});
}


server.on('message', function (message, remote)      //SERVIDOR ESCUCHANDO LA LLEGADA DE UN MENSAJE DE UN CLIENTE
{
  var existingport=false;                            //Bandera para identificar si el cliente esta logeado

  if(message == "exit")                              //Si el mensaje es "exit" se va a la funcion de Descnexion
  {
    DeleteConection(remote);
  }
  else
  {
    if(clientPort.includes(remote.port))              // Se mira si el cliente ya ha sido logeado 
    {
        existingport = true;
    }
    else
    {
      NewConection(remote);                           // Si no esta logeado se agrega sus direcciones 
      existingport=false;
    }
    if(existingport)                                  /// Si el cliente ya esta logeado  se almacena el mensaje
    {
      var answer = util.format('<'+remote.address+':'+remote.port+">:    "+message)  
      //var answer = util.format('%d: %s', remote.port , message)
      console.log(answer);
      Broadcast(answer,remote);                       // se distribuye el mensaje del cliente a los demas clientes
    }
  }
});




server.bind(PORT, HOST);
