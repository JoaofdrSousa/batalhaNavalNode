"use strict";
var Authentication = (function () {
    function Authentication() {
        var _this = this;
        this.login = function (request, response, next) {
            console.log("estou no servidor quero logar");
            var player = request.user;
            response.json(player);
            console.log(player);
            console.log("loguei");
            return next();
        };
        this.logout = function (request, response, next) {
            console.log("estou no servidor vou sair");
            request.logOut();
            response.json({ msg: 'Logout' });
            return next();
        };
        this.init = function (server, settings) {
            server.post(settings.prefix + 'login', settings.security.passport.authenticate('local', { 'session': false }), _this.login);
            server.post(settings.prefix + 'logout', settings.security.authorize, _this.logout);
            // server.post(settings.prefix + 'register', this.registerPlayer);
            console.log("Authentication routes registered");
        };
    }
    return Authentication;
}());
exports.Authentication = Authentication;
