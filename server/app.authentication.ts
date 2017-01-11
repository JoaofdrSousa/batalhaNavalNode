import {HandlerSettings} from './handler.settings';

export class Authentication{
   
    public login = (request: any, response: any, next: any) => {
        console.log("estou no servidor quero logar");
        let player = request.user;
        response.json(player);
        console.log(player);

        console.log("loguei");
        return next();
}

    public logout = (request: any, response: any, next: any) => {
        console.log("estou no servidor vou sair");
        request.logOut();
        response.json({msg: 'Logout'});
        return next();
    }  

    public init = (server: any, settings: HandlerSettings) => {
        server.post(settings.prefix + 'login',settings.security.passport.authenticate('local', {'session':false}), this.login);
        server.post(settings.prefix + 'logout', settings.security.authorize, this.logout);
       // server.post(settings.prefix + 'register', this.registerPlayer);
        console.log("Authentication routes registered");
    }  
} 

