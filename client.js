/* jshint esversion: 6 */
var ChatBox = ChatBox || {};

ChatBox.newClient = {

    initialize : function () {

        var clients = [];

        var clientCreate = function (socket, name) {
            var me = this;
            me.send = function(message) {
                me.socket.write(message + '\n');
            };

            me.toString = function() {
                return me.name;
            };

            me.socket = socket;
            me.name = name;
            var users = 'Users: ' + clients.join(', ');
            if(clients.length < 0){
                me.send("Here are some users to chat" + users);
            }else {
                me.send("Looks like no one is here");
            }

        };

        var getClientBySocket = function(socket) {
            for (let ii = 0, n = clients.length; ii < n; ii++) {
                if (clients[ii].socket == socket) {
                    return clients[ii];
                }
            }
        };

        var getClientByname = function(name) {
            for (let ii = 0, n = clients.length; ii < n; ii++) {
                if (clients[ii].name == name) {
                    return clients[ii];
                }
            }
        };

        this.sendToAll = function (message) {
            for (let ii = 0, n = clients.length; ii < n; ii++) {
                clients[ii].send(message);
            }
        };

        this.addClient = function (socket, name) {
            this.sendToAll(name +' logged in.\n');
            var client = new clientCreate(socket, name);
            clients.push(client);
            return client;
        };

        this.handleCommand = function (command, socket) {
            var client = getClientBySocket(socket);

            if (command.substring(0, 1) != '/') { //check is command
                return false;
            }

            command = command.split(' ');
            var type = command[0];
            var value = command.length > 1 ? command[1] : null;

            switch (type) {

                case '/private':
                    var cmdClient = getClientByname(value);

                    if (!cmdClient) {
                        client.send('User not found!');
                        return;
                    }

                    var message = command.splice(2, command.length).join(' ');
                    cmdClient.send(client + ' says ' + message);

                break;

                case '/users':
                    var users = 'Users: ' + clients.join(', ');
                    client.send(users);
                break;
            }
            return true;
        };
    }

};


module.exports = ChatBox.newClient.initialize;
