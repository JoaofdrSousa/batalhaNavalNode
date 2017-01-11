"use strict";
var gameValidator_1 = require("./gameValidator");
var Posicao = (function () {
    function Posicao(linha, coluna) {
        var linhaLetra;
        if (typeof linha === "string") {
            linhaLetra = linha[0];
        }
        else {
            linhaLetra = String.fromCharCode('A'.charCodeAt(0) + linha - 1);
        }
        if (!gameValidator_1.GameValidator.verificaColuna(coluna)) {
            throw new Error('Valor da coluna "' + coluna + '" é inválido');
        }
        if (!gameValidator_1.GameValidator.verificaLinha(linhaLetra)) {
            throw new Error('Valor da linha "' + linhaLetra + '" é inválido');
        }
        this.linha = linhaLetra;
        this.coluna = coluna;
    }
    // Exemplos: A3; H10; A1; ...
    Posicao.prototype.strValue = function () {
        return this.linha + this.coluna;
    };
    // A=1; B=2; ...
    Posicao.prototype.linhaAsNumber = function () {
        return this.linha.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    };
    // index a começar em zero (A=0; B=1)
    Posicao.prototype.linhaIndex = function () {
        return this.linhaAsNumber() - 1;
    };
    // index a começar em zero (Coluna1=0; Coluna2=1)
    Posicao.prototype.colunaIndex = function () {
        return this.coluna - 1;
    };
    Posicao.prototype.sobreposicao = function (p) {
        return (p.linha == this.linha) && (p.coluna == this.coluna);
    };
    // Extrair posições repetidas de um array
    Posicao.removeRepetidos = function (posicoes) {
        var result = [];
        for (var i = 0; i < posicoes.length; i++) {
            if (!Posicao.existe(posicoes[i], result)) {
                result.push(posicoes[i]);
            }
        }
        return result;
    };
    // Faz o merge de 2 arrays de Posicoes e retira os repetidos
    Posicao.merge = function (posicoes1, posicoes2) {
        var result = posicoes1;
        result = result.concat(posicoes2);
        return Posicao.removeRepetidos(result);
    };
    // Verifica se uma determinada posição existe num array
    Posicao.existe = function (posicao, arrayPosicoes) {
        for (var i = 0; i < arrayPosicoes.length; i++) {
            if (posicao.sobreposicao(arrayPosicoes[i])) {
                return true;
            }
        }
        return false;
    };
    // Verifica se existe algum conflito entre 2 arrays de posições
    // Considera-se que há conflito, se pelo menos uma posição aparecer nos 2 arrays
    Posicao.conflito = function (arrayPosicoes1, arrayPosicoes2) {
        for (var i = 0; i < arrayPosicoes1.length; i++) {
            if (Posicao.existe(arrayPosicoes1[i], arrayPosicoes2)) {
                return true;
            }
        }
        return false;
    };
    return Posicao;
}());
exports.Posicao = Posicao;
