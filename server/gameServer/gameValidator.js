"use strict";
var tabuleiro_1 = require("./tabuleiro");
var navio_1 = require("./navio");
var navio_2 = require("./navio");
var GameValidator = (function () {
    function GameValidator() {
    }
    // Verifica se os valores da coluna estão corretos
    GameValidator.verificaColuna = function (coluna) {
        if ((coluna < 1) || (coluna > 10)) {
            return false;
        }
        return true;
    };
    // Verifica se os valores da linha estão corretos
    GameValidator.verificaLinha = function (linha) {
        return tabuleiro_1.Tabuleiro.todasLinhas().indexOf(linha) > -1;
    };
    // Verifica se o valor da orientacao é adequado ao tipo de navio
    GameValidator.verificaOrientacao = function (tipo, orientacao) {
        switch (tipo) {
            case navio_1.TipoNavio.PortaAvioes:
                return true;
            case navio_1.TipoNavio.Couracado:
            case navio_1.TipoNavio.Cruzador:
            case navio_1.TipoNavio.ContraTorpedeiro:
                return (orientacao == navio_2.Orientacao.Normal) || (orientacao == navio_2.Orientacao.Roda90);
            case navio_1.TipoNavio.Submarino:
                return (orientacao == navio_2.Orientacao.Normal);
        }
    };
    // Verifica se um navio de um determinado tipo e com determinada orientação, cabe ou não dentro do tabuleiro
    GameValidator.verificaLimites = function (tipo, orientacao, posicao) {
        console.log('VERIFICA LIMITES');
        console.log('Tipo = ' + tipo);
        console.log('Orientacao = ' + orientacao);
        console.log(typeof posicao.coluna);
        console.log('Posicao = ' + posicao.strValue());
        if (tipo == navio_1.TipoNavio.Submarino) {
            return true;
        }
        var offsetVertical = 0;
        var offsetHorizontal = 0;
        switch (orientacao) {
            case navio_2.Orientacao.Normal:
                switch (tipo) {
                    case navio_1.TipoNavio.PortaAvioes:
                        offsetVertical = 2;
                        offsetHorizontal = 2;
                        break;
                    case navio_1.TipoNavio.Couracado:
                        offsetHorizontal = 3;
                        break;
                    case navio_1.TipoNavio.Cruzador:
                        offsetHorizontal = 2;
                        break;
                    case navio_1.TipoNavio.ContraTorpedeiro:
                        offsetHorizontal = 1;
                        break;
                }
                break;
            case navio_2.Orientacao.Roda90:
                switch (tipo) {
                    case navio_1.TipoNavio.PortaAvioes:
                        offsetVertical = 2;
                        offsetHorizontal = -2;
                        break;
                    case navio_1.TipoNavio.Couracado:
                        offsetVertical = 3;
                        break;
                    case navio_1.TipoNavio.Cruzador:
                        offsetVertical = 2;
                        break;
                    case navio_1.TipoNavio.ContraTorpedeiro:
                        offsetVertical = 1;
                        break;
                }
                break;
            case navio_2.Orientacao.Roda180:
                if (tipo === navio_1.TipoNavio.PortaAvioes) {
                    offsetVertical = -2;
                    offsetHorizontal = -2;
                }
                else {
                    return false;
                }
                break;
            case navio_2.Orientacao.Roda270:
                if (tipo === navio_1.TipoNavio.PortaAvioes) {
                    offsetVertical = -2;
                    offsetHorizontal = 2;
                }
                else {
                    return false;
                }
        }
        console.log("posicao.coluna");
        console.log(posicao.coluna);
        console.log(typeof posicao.coluna);
        console.log("offsetHorizontal");
        console.log(offsetHorizontal);
        console.log(typeof offsetHorizontal);
        console.log(posicao.coluna + offsetHorizontal);
        if (((posicao.coluna + offsetHorizontal) < 1) || ((posicao.coluna + offsetHorizontal) > 10)) {
            return false;
        }
        console.log("posicao.linhaAsNumber()");
        console.log(posicao.linhaAsNumber());
        console.log("offsetVertical");
        console.log(offsetVertical);
        if (((posicao.linhaAsNumber() + offsetVertical) < 1) || ((posicao.linhaAsNumber() + offsetVertical) > 10)) {
            return false;
        }
        return true;
    };
    return GameValidator;
}());
exports.GameValidator = GameValidator;
