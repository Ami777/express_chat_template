function registerRoutes(socket, chat) {
    socket.on('/msg/add', data => {
        const {msg, nick} = data;

        chat.newMsg(msg, nick);
    });
}

module.exports = registerRoutes;