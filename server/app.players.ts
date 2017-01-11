const mongodb = require('mongodb');
const util = require('util');
const sha1 = require('sha1');
import {HandlerSettings} from './handler.settings';
import {databaseConnection as database} from './app.database';

export class Player {

    private settings: HandlerSettings = null;

    private handleError = (err: string, response: any, next: any) => {
                    console.log("errooo");
            console.log(err);
    	response.send(500, err);
	    next();
    }

    private returnPlayer = (id:string, response: any, next: any) => {
        database.db.collection('players')
            .findOne({
                _id: id
            })
            .then((player) => {
                if (player === null) {
                    response.send(404, 'Player not found');
                } else {
                    response.json(player);
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getPlayers = (request: any, response: any, next: any) => {
        database.db.collection('players')
            .find()
            .toArray()
            .then(players => {
                response.json(players || []);
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public getPlayer =  (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        this.returnPlayer(id, response, next);
    }
    
    public updatePlayer = (request: any, response: any, next: any) => {
        const id = new mongodb.ObjectID(request.params.id);
        const player = request.body;

        if (player === undefined) {
            response.send(400, 'No player data');
            return next();
        }
        delete player._id;
        database.db.collection('players')
            .updateOne({
                _id: id
            }, {
                $set: player
            })
            .then(result => this.returnPlayer(id, response, next))
            .catch(err => this.handleError(err, response, next));
    }
    
    public createPlayer = (request: any, response: any, next: any) => {
        const player = request.body;
        if (player === undefined) {
            response.send(400, 'No player data');
            return next();
        }
        database.db.collection('players')
            .insertOne(player)
            .then(result => this.returnPlayer(result.insertedId, response, next))
            .catch(err => this.handleError(err, response, next));
    }


private createPlayerDB = (player: any) => {
        if (player === undefined) {
            return null;
        }
        let result : any = null;
        database.db.collection('users')
            .insertOne(player)
            .then(result => result.insertedId)
            .catch(result => null);
    }

    public deletePlayer = (request: any, response: any, next: any) => {
        var id = new mongodb.ObjectID(request.params.id);
        database.db.collection('players')
            .deleteOne({
                _id: id
            })
            .then(result => {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('Player -%s- Deleted', id)
                    });
                } else {
                    response.send(404, 'No player found');
                }
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }
        
    public getTop10 = (request: any, response: any, next: any) => {
        database.db.collection('users')
            .find()
            .sort({totalVictories:-1})
            .limit(10)
            .toArray()
            .then(players => {
                response.json(players || []);
                this.settings.wsServer.notifyAll('players', Date.now() + ': Somebody accessed top 10');
                next();
            })
            .catch(err => this.handleError(err, response, next));
    }

    public createPlayer2 = (request: any, response: any, next: any) => {
        database.db.collection('players')
            .findOne({ username: request.body.username })
            .then((player) => {
                if (player !== null) {
                    response.json({
                        msg: util.format('username error')
                    });
                } {
                    const player = request.body;
                    if (player === undefined) {
                        response.send(400, 'No player data');
                        return next();
                    }
                        player.username = request.body.username
                        player.email = request.body.email
                        player.passwordHash = sha1(request.body.password)
                        player.avatar = 'https://api.adorable.io/avatars/285/richard.png'
                        player.totalVictories = '0'
                        player.totalScore = '0'                   

                    database.db.collection('players')
                        .insertOne(player)
                        .then(result => this.returnPlayer(result.insertedId, response, next))
                        .catch(err =>
                            this.handleError(err, response, next)
                        );
                }
            })
            .catch(err => this.handleError(err, response, next));
    }


    // Routes for the games
    public init = (server: any, settings: HandlerSettings) => {
        this.settings = settings;
        server.get(settings.prefix + 'top10', this.getTop10);
        server.get(settings.prefix + 'players', settings.security.authorize, this.getPlayers);
        server.get(settings.prefix + 'players/:id', settings.security.authorize, this.getPlayer);
        server.put(settings.prefix + 'players/:id', settings.security.authorize, this.updatePlayer);
        server.post(settings.prefix + 'players', settings.security.authorize, this.createPlayer);
        server.del(settings.prefix + 'players/:id', settings.security.authorize, this.deletePlayer);
        console.log("Players routes registered");
        server.post(settings.prefix + 'register', this.createPlayer2);
        //console.log("Players routes registered");
    };
}