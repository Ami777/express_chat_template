const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const registerSocketRoutes = require('./routes/socket');
const registerExpressRoutes = require('./routes/express');
const path = require("path");

class ChatBackend{
    constructor(){
        this.users = [];
        this.app = express();
        const http = require('http')
            .Server(this.app);
        this.io = require('socket.io')(http);

        this._registerMiddlewares();
        this._registerRoutes();

        http.listen(3000, () => {
            console.log('Server running at http://localhost:3000');
        });
    }

    checkAndRegisterUser(nick){
        if (this.users.indexOf(nick) === -1){
            this.users.push(nick);
            return true;
        } else {
            return false;
        }
    }

    _registerMiddlewares(){
        this.app.use(cookieParser());
        this.app.use(bodyParser.json())
        this.app.use(express.static(
            path.join(__dirname, '../static')
        ));
    }

    _registerRoutes(){
        registerExpressRoutes(this.app, this);

        this.io.on('connection', socket => {
            console.log('New Client connected.');
            registerSocketRoutes(socket, this);
        });
    }

    newMsg(msg, nick){
        //Mini-sec: sprawdzamy czy taki User w ogóle istnieje
        if (this.users.indexOf(nick) === -1) return;

        //Mini-estetyka: czy wiadomośc istnieje
        if (msg.trim() === '') return;

        this.io.emit('/msg/refresh', {
            msg,
            nick,
        });
    }
}

module.exports = ChatBackend;