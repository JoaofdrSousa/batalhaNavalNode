"use strict";
var navio_1 = require("./navio");
var celula_1 = require("./celula");
var posicao_1 = require("./posicao");
var Tabuleiro = (function () {
    function Tabuleiro() {
        var _this = this;
        this.celulas = [];
        this.posicoesOcupadas = [];
        this.navios = [];
        Tabuleiro.todasLinhas().forEach(function (letra) {
            Tabuleiro.todasColunas().forEach(function (coluna) {
                var c = new celula_1.Celula(letra, coluna);
                _this.celulas.push(c);
            });
        });
    }
    // Devolve a célula que está na posição linha, coluna
    Tabuleiro.prototype.getCelula = function (linha, coluna) {
        console.log('get celula');
        console.log(linha);
        console.log(coluna);
        var posicao = new posicao_1.Posicao(linha, coluna);
        console.log(posicao);
        console.log(this.celulas);
        return this.celulas[posicao.linhaIndex() * 10 + posicao.colunaIndex()];
    };
    Tabuleiro.prototype.adicionaNavio = function (tipo, orientacao, linha, coluna) {
        var _this = this;
        try {
            var navio_2 = new navio_1.Navio(tipo, orientacao, linha, coluna);
            if (posicao_1.Posicao.conflito(navio_2.posicoesOcupadas, this.posicoesOcupadas)) {
                throw new Error('O navio "' + tipo + '" na posição (' + linha + coluna + ') e orientação "' + orientacao + '" está em sobreposição ou encostado a um navio já existente');
            }
            navio_2.posicoesOcupadas.forEach(function (p) {
                navio_2.addCelula(_this.getCelula(p.linha, p.coluna));
            });
            this.posicoesOcupadas = posicao_1.Posicao.merge(this.posicoesOcupadas, navio_2.posicoesVizinhas);
            this.navios.push(navio_2);
            return navio_2;
        }
        catch (e) {
            // Alterar para fazer tratamento de erros
            throw e;
        }
    };
    // Devolve as células na forma de matriz - usar só para testes (performance inferior à propriedade celulas)
    Tabuleiro.prototype.celulasMatrix = function () {
        var _this = this;
        var c = [];
        Tabuleiro.todasLinhas().forEach(function (linha) {
            var l = [];
            Tabuleiro.todasColunas().forEach(function (coluna) {
                l.push(_this.getCelula(linha, coluna));
            });
            c.push(l);
        });
        return c;
    };
    // Devolve a célula que está na posição linha, coluna
    Tabuleiro.prototype.limpaRefCirc = function () {
        this.celulas.forEach(function (celula) {
            celula.pertenceA = null;
        });
    };
    // ------------------------------------------------------------------------------------------------
    // Métodos estátios auxiliares
    // ------------------------------------------------------------------------------------------------
    Tabuleiro.todasLinhas = function () {
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    };
    Tabuleiro.todasColunas = function () {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    };
    return Tabuleiro;
}());
exports.Tabuleiro = Tabuleiro;
