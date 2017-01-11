"use strict";
var tabuleiro_1 = require("./tabuleiro");
var Game = (function () {
    function Game(numeroTabuleiro) {
        this.tabuleiros = [];
        for (var i = 0; i < numeroTabuleiro; i++) {
            var t = new tabuleiro_1.Tabuleiro();
            this.tabuleiros.push(t);
        }
    }
    return Game;
}());
exports.Game = Game;
