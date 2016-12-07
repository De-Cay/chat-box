/* jshint esversion: 6 */
var ChatBox = ChatBox || {};

ChatBox.newClient = {

    initialize : function () {

        var clients = [];

        var createClient = function (socket, name) {
            var me = this;

            me.socket = socket;

            me.name = name;

            me.send = function(message) {
                me.socket.write(message + '\n');
            };

            // To print the users name
            me.toString = function() {
                return me.name;
            };

            var users = 'Users: ' + clients.join(', ');
            if(clients.length > 0){
                me.send("Here are some users to chat" + users+" \nFor chat use '/<userName> <message>' ");
            }else {
                me.send("Looks like no one is here. \nFor chat use '/<userName> <message>' ");
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

        var isUserExist = function (name) {
            for (let ii = 0, n = clients.length; ii < n; ii++) {
                if (clients[ii].name == name) {
                    return true;
                }
            }
            return false;
        };

        var sendToAll = function (message) {
            for (let ii = 0, n = clients.length; ii < n; ii++) {
                clients[ii].send(message);
            }
        };


        this.addClient = function (socket, name) {
            if(isUserExist(name)){
                socket.write("This user already exist. Choose other name\n");
                return false;
            }else {
                sendToAll(name +' logged in.\n');
                var client = new createClient(socket, name);
                clients.push(client);
                return client;
            }
        };

        this.handleCommand = function (data, socket) {
            var sender = getClientBySocket(socket);

            if (data.substring(0, 1) != '/') {
                return false;
            }

            var index = data.indexOf(" ");
            var name = data.substring(1, index);
            var message = data.substring(index+1, data.length);

            var receiver = getClientByname(name);
            if (!receiver) {
                sender.send('User not found!');
                return;
            }
            receiver.send(sender + ' says: ' + message);

            return true;
        };
    }

};


module.exports = ChatBox.newClient.initialize;
