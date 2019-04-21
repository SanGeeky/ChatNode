var PORT = 33333;
var HOST = '127.0.0.1';

var clients = [];
var clientPort =[];
var objectToSave = [];

var dgram = require('dgram');
var util = require('util');
var server = dgram.createSocket('udp4');


// var answer = new Buffer.from('Hola amikoooslkfffffffsadfasdf');
// var remotePORT ;
// var remoteHOST ;

server.on('listening', function () {
    var address = server.address();
    console.log(' Servidor UDP esuchando en ' + address.address + ":" + address.port);
});

function NewConection(remote)
{
  clients.push(remote);
  clientPort.push(remote.port);

  var answer = util.format("\nNueva conexion de cliente: [" + remote.address+':'+remote.port+"]");
  Broadcast(answer,remote)
  console.log(answer);
}

function DeleteConection(remote)
{
  var answer = util.format("Desconexion de: " + "<" + remote.address + ':' + remote.port + ">");
  Broadcast(answer,remote)
  console.log(answer);

  clients.splice(clients.indexOf(remote), 1)
  clientPort.splice(clientPort.indexOf(remote.port), 1)
}

function Broadcast(message, remote)
{
  var answer = new Buffer(message);
  
  Save(message);
  
  clients.forEach(function(client) {
    
    if (clientPort.includes(remote.port) && client.port != remote.port ) {
      server.send(answer, 0, answer.length, client.port, client.address);
    }
  });
}

function Save(message)
{
  const fs = require('fs');
 
  objectToSave.push(message)

  fs.writeFile('historial.json', JSON.stringify(objectToSave),'utf8', (err) => {
    if (err) throw err;
    //console.log('The file has been saved!');
});
}


server.on('message', function (message, remote) 
{
  var existingport=false;
  //var answer = new Buffer.from(message);

  // clients.forEach(function(client) {

  //   if (client.port != remote.port) {
  //     var answer = util.format('%d => %s', remote.port , message)
  //     console.log(answer);
  //     Broadcast(answer,remote);
  //   }
  //   else
  //   {
  //     NewConection(remote);
  //   }
  //         ///Envia a todos los clientes
  // });
  if(message == "exit")
  {
    DeleteConection(remote);
  }
  else
  {
    if(clientPort.includes(remote.port))
    {
        existingport = true;
        // console.info("entro a repetido")
    }
    else
    {
        // console.info("entro a nuevo")
      NewConection(remote);
      existingport=false;
    }
    if(existingport)
    {
      var answer = util.format('<'+remote.address+':'+remote.port+">:    "+message)                    // Si la bandera es true, se distribuye el mensaje del cliente
      //var answer = util.format('%d: %s', remote.port , message)
      console.log(answer);
      Broadcast(answer,remote);
    }
  }
  
      
  
  // console.log(clients);
  // console.log(clientPort);
  
  //console.log(remote.address + ':' + remote.port +' - ' + message);
    
    
    // remoteHOST=remote.address;
    // remotePORT=remote.port;
    // server.send(answer, 0, answer.length, remotePORT, remoteHOST , function(err, bytes){
    //   if (err) throw err;
    //   //console.log('Mensaje recibido /*/**/*/*/*/*/*/' + answer);
});




server.bind(PORT, HOST);
