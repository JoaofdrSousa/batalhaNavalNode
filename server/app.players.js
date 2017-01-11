"use strict";
var mongodb = require('mongodb');
var util = require('util');
var sha1 = require('sha1');
var app_database_1 = require("./app.database");
var Player = (function () {
    function Player() {
        var _this = this;
        this.settings = null;
        this.handleError = function (err, response, next) {
            console.log("errooo");
            console.log(err);
            response.send(500, err);
            next();
        };
        this.returnPlayer = function (id, response, next) {
            app_database_1.databaseConnection.db.collection('players')
                .findOne({
                _id: id
            })
                .then(function (player) {
                if (player === null) {
                    response.send(404, 'Player not found');
                }
                else {
                    response.json(player);
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getPlayers = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('players')
                .find()
                .toArray()
                .then(function (players) {
                response.json(players || []);
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getPlayer = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            _this.returnPlayer(id, response, next);
        };
        this.updatePlayer = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            var player = request.body;
            if (player === undefined) {
                response.send(400, 'No player data');
                return next();
            }
            delete player._id;
            app_database_1.databaseConnection.db.collection('players')
                .updateOne({
                _id: id
            }, {
                $set: player
            })
                .then(function (result) { return _this.returnPlayer(id, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.createPlayer = function (request, response, next) {
            var player = request.body;
            if (player === undefined) {
                response.send(400, 'No player data');
                return next();
            }
            app_database_1.databaseConnection.db.collection('players')
                .insertOne(player)
                .then(function (result) { return _this.returnPlayer(result.insertedId, response, next); })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.createPlayerDB = function (player) {
            if (player === undefined) {
                return null;
            }
            var result = null;
            app_database_1.databaseConnection.db.collection('users')
                .insertOne(player)
                .then(function (result) { return result.insertedId; })
                .catch(function (result) { return null; });
        };
        this.deletePlayer = function (request, response, next) {
            var id = new mongodb.ObjectID(request.params.id);
            app_database_1.databaseConnection.db.collection('players')
                .deleteOne({
                _id: id
            })
                .then(function (result) {
                if (result.deletedCount === 1) {
                    response.json({
                        msg: util.format('Player -%s- Deleted', id)
                    });
                }
                else {
                    response.send(404, 'No player found');
                }
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.getTop10 = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('users')
                .find()
                .sort({ totalVictories: -1 })
                .limit(10)
                .toArray()
                .then(function (players) {
                response.json(players || []);
                _this.settings.wsServer.notifyAll('players', Date.now() + ': Somebody accessed top 10');
                next();
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        this.createPlayer2 = function (request, response, next) {
            app_database_1.databaseConnection.db.collection('players')
                .findOne({ username: request.body.username })
                .then(function (player) {
                if (player !== null) {
                    response.json({
                        msg: util.format('username error')
                    });
                }
                {
                    var player_1 = request.body;
                    if (player_1 === undefined) {
                        response.send(400, 'No player data');
                        return next();
                    }
                    player_1.username = request.body.username;
                    player_1.email = request.body.email;
                    player_1.passwordHash = sha1(request.body.password);
                    player_1.avatar = 'https://api.adorable.io/avatars/285/richard.png';
                    player_1.totalVictories = '0';
                    player_1.totalScore = '0';
                    app_database_1.databaseConnection.db.collection('players')
                        .insertOne(player_1)
                        .then(function (result) { return _this.returnPlayer(result.insertedId, response, next); })
                        .catch(function (err) {
                        return _this.handleError(err, response, next);
                    });
                }
            })
                .catch(function (err) { return _this.handleError(err, response, next); });
        };
        // Routes for the games
        this.init = function (server, settings) {
            _this.settings = settings;
            server.get(settings.prefix + 'top10', _this.getTop10);
            server.get(settings.prefix + 'players', settings.security.authorize, _this.getPlayers);
            server.get(settings.prefix + 'players/:id', settings.security.authorize, _this.getPlayer);
            server.put(settings.prefix + 'players/:id', settings.security.authorize, _this.updatePlayer);
            server.post(settings.prefix + 'players', settings.security.authorize, _this.createPlayer);
            server.del(settings.prefix + 'players/:id', settings.security.authorize, _this.deletePlayer);
            console.log("Players routes registered");
            server.post(settings.prefix + 'register', _this.createPlayer2);
            //console.log("Players routes registered");
        };
    }
    return Player;
}());
exports.Player = Player;
