var ChatBox = ChatBox || {};

ChatBox.constant = function () {
    return{
        net : require('net'),
        host : '127.0.0.1',
        port : 7070
    };
};

module.exports = ChatBox.constant;
