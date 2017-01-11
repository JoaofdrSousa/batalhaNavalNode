"use strict";
var tabuleiro_1 = require("./gameServer/tabuleiro");
var game_1 = require("./gameServer/game");
var celula_1 = require("./gameServer/celula");
var io = require('socket.io');
var WebSocketServer = (function () {
    function WebSocketServer() {
        var _this = this;
        this.socketsIds = [];
        this.players = [];
        this.init = function (server) {
            _this.io = io.listen(server);
            _this.io.sockets.on('connection', function (client) {
                client.player = new Player();
                client.player.game = new game_1.Game(2);
                client.emit('game', client.player.game);
                client.emit('players', Date.now() + ': Welcome to battleship');
                client.broadcast.emit('players', Date.now() + ': A new player has arrived');
                client.on('chat', function (data) { return _this.io.emit('chat', data); });
                client.on('tiro', function (celula) {
                    _this.players.forEach(function (player) {
                        if (client.player.username != player.username) {
                            player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro = true;
                            if (player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo == celula_1.TipoCelula.Mar) {
                                player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo = celula_1.TipoCelula.MarComTiro;
                                _this.notifyAll('game', { linha: celula.posicao.linha, coluna: celula.posicao.coluna, tiro: player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro, tipo: player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo, playerAlvo: player.username });
                            }
                            else if (player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo == celula_1.TipoCelula.Navio) {
                                player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo = celula_1.TipoCelula.NavioComTiro;
                                _this.notifyAll('game', { linha: celula.posicao.linha, coluna: celula.posicao.coluna, tiro: player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro, tipo: player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo, playerAlvo: player.username });
                            }
                        }
                    });
                    /*client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro = true;
                    console.log(client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna));
                    if(client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo == TipoCelula.Mar){
                        client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo = TipoCelula.MarComTiro
                        this.notifyAll('game', {linha : celula.posicao.linha, coluna : celula.posicao.coluna, tiro : client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro, tipo : client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo });
                    }else if(client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo == TipoCelula.Navio){
                        client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo = TipoCelula.NavioComTiro
                       this.notifyAll('game', {linha : celula.posicao.linha, coluna : celula.posicao.coluna, tiro : client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro, tipo : client.player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo });
                    }*/
                });
                client.on('game1', function (board) {
                    client.player.socketId = client.id;
                    client.player.username = board.username;
                    board.auxBarcos.forEach(function (barco) {
                        client.player.tabuleiro.adicionaNavio(barco.tipo, barco.orientacao, barco.linha, barco.coluna);
                    });
                    _this.socketsIds.push(client.id);
                    _this.socketsIds.forEach(function (id) {
                        var p = new Player();
                        p.username = _this.io.sockets.sockets[id].player.username;
                        p.socketId = _this.io.sockets.sockets[id].player.socketId;
                        p.tabuleiro = _this.io.sockets.sockets[id].player.tabuleiro;
                        _this.players.push(p);
                    });
                    client.emit('game', 'Game is readdy');
                });
            });
        };
        this.notifyAll = function (channel, message) {
            _this.io.sockets.emit(channel, message);
        };
    }
    WebSocketServer.prototype.copiaBoard = function (tabToFill, tabSource) {
        tabToFill.celulas = tabSource.celulas;
        tabToFill.navios = tabSource.navios;
        tabToFill.posicoesOcupadas = tabSource.posicoesOcupadas;
    };
    return WebSocketServer;
}());
exports.WebSocketServer = WebSocketServer;
;
var Player = (function () {
    function Player() {
        this.game = new game_1.Game(1);
        this.tabuleiro = new tabuleiro_1.Tabuleiro();
        this.username = '';
        this.socketId = '';
    }
    return Player;
}());
exports.Player = Player;
