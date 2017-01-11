"use strict";
var posicao_1 = require("./posicao");
var TipoCelula;
(function (TipoCelula) {
    TipoCelula[TipoCelula["Mar"] = 0] = "Mar";
    TipoCelula[TipoCelula["Navio"] = 1] = "Navio";
    TipoCelula[TipoCelula["MarComTiro"] = 2] = "MarComTiro";
    TipoCelula[TipoCelula["NavioComTiro"] = 3] = "NavioComTiro";
})(TipoCelula = exports.TipoCelula || (exports.TipoCelula = {}));
var Celula = (function () {
    function Celula(linha, coluna) {
        this.posicao = new posicao_1.Posicao(linha, coluna);
        this.tipo = TipoCelula.Mar;
        this.tiro = false;
        this.pertenceA = null;
    }
    Celula.prototype.sobreposicao = function (c) {
        return (c.posicao.linha == this.posicao.linha) && (c.posicao.coluna == this.posicao.coluna);
    };
    // Verifica se uma determinada celula existe num array
    Celula.existe = function (celula, arrayCelulas) {
        for (var i = 0; i < arrayCelulas.length; i++) {
            if (celula.sobreposicao(arrayCelulas[i])) {
                return true;
            }
        }
        return false;
    };
    return Celula;
}());
exports.Celula = Celula;
