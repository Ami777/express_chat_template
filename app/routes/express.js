function registerRoutes(app, chat) {
    app.get('/nick/get', (req, res) => {
        if (req.cookies.nick){
            chat.checkAndRegisterUser(req.cookies.nick);
            res.json({
                nick : req.cookies.nick,
            });
        } else {
            res.json({
                nick : false,
            });
        }
    });

    app.post('/nick/set', (req, res) => {
        if (chat.checkAndRegisterUser(req.body.nick)){
            res.cookie('nick', req.body.nick);
            res.json({
                isAvailable : true,
            });
        } else {
            res.json({
                isAvailable : false,
            });
        }
    });
}

module.exports = registerRoutes;