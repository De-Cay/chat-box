/* jshint esversion: 6 */
var ChatBox = ChatBox || {};

ChatBox.newServer = {

    initialize: function () {
        var nodeNet = require('net');
        var client = require('./client');
        var newClient = new client();
        var host = '127.0.0.1';
        var port = 7070;
        var server = nodeNet.createServer();
        server.listen(port, host);

        setTimeout(() => { // won`t exceute unless the server is defined.
            console.log('Server listening on ' + server.address().address +':'+ server.address().port);
        }, 0);

        server.on('connection', remote => {
            console.log('CONNECTED: ' + remote.remoteAddress +':'+ remote.remotePort);
            remote.write("Create User name and starts with '$'\n");

            remote.on('data', data => {
                var message = data.toString();
                message = message.substring(0, message.length - 1);

                if(message.indexOf('$') !== -1){
                    message = message.substring(1, message.length);
                    if(newClient.addClient(remote, message)){
                        remote.write("Your user name: " + message+"\n");
                    }
                }

                console.log(message);

                if (newClient.handleCommand(message, remote)) {
                    return;
                }
            });


            remote.on('close', data => {
                console.log('CLOSED: ' + remote.remoteAddress +' '+ remote.remotePort);
            });
        });
    }
};

module.exports = ChatBox.newServer.initialize;
