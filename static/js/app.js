async function init(){
    const socket = io();

    const nick = await getNick();

    registerNewMsgEvent(socket, nick);
    registerSocketRoutes(socket);
}

async function registerSocketRoutes(socket) {
    const ul = document.querySelector('ul');

    socket.on('/msg/refresh', data => {
        const {nick, msg} = data;

        const li = document.createElement('li');
        const strong = document.createElement('strong');
        const p = document.createElement('p');

        //Uzywając innerText mamy pewność, że nikt nie wykona ataku XSS!
        strong.innerText = nick;
        p.innerText = msg;
        li.appendChild(strong);
        li.appendChild(p);

        ul.appendChild(li);
    });
}

async function registerNewMsgEvent(socket, nick) {
    const form = document.querySelector('form');
    const input = document.querySelector('input');

    form.addEventListener('submit', event => {
        event.preventDefault();

        const msg = input.value;

        socket.emit('/msg/add', {
            msg,
            nick,
        });

        input.value = '';
    });
}

async function getNick() {
    const {nick} = await askBackendForNick();

    if (nick === false){
        let isAvailable;
        do{
            const yourNick = prompt('Twój nick');
            const checkResp = await sendNickToBackend(yourNick);
            isAvailable = checkResp.isAvailable;
            if (isAvailable) return yourNick;
        }while(!isAvailable);
    } else {
        return nick;
    }
}

async function sendNickToBackend(nick) {
    return fetch('/nick/set', {
        method : 'POST',
        body : JSON.stringify({
            nick,
        }),
        headers : {
            'Content-Type' : 'application/json',
        },
        credentials : 'include',
    })
        .then(r => r.json());

}

async function askBackendForNick() {
    return fetch('/nick/get', {
        //To trzeba dodać do opcji fetcha, żeby działał z ciastkami:
        credentials : 'include',
    })
        .then(r => r.json());

}

document.addEventListener('DOMContentLoaded', init);