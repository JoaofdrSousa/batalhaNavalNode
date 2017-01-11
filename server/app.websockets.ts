import {Tabuleiro } from './gameServer/tabuleiro';
import {Navio, TipoNavio, Orientacao } from './gameServer/navio';
import {Game } from './gameServer/game';
import {Posicao } from './gameServer/posicao';
import {Celula, TipoCelula } from './gameServer/celula';



const io = require('socket.io');


export class WebSocketServer {
    socketsIds : string [] = [];
    players : Player [] = [];
    public io: any;

    public init = (server: any) => {
        this.io = io.listen(server); 

        this.io.sockets.on('connection', (client: any) => {
            client.player = new Player();
             client.player.game = new Game(2);

            client.emit('game', client.player.game);
            client.emit('players', Date.now() + ': Welcome to battleship');
            client.broadcast.emit('players', Date.now() + ': A new player has arrived');
            client.on('chat', (data) => this.io.emit('chat', data));
      
            client.on('tiro', (celula) => {
               
                this.players.forEach((player : Player)=>{
                    if(client.player.username != player.username){
                         player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro = true;
                
                if(player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo == TipoCelula.Mar){
                    player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo = TipoCelula.MarComTiro
                    this.notifyAll('game', {linha : celula.posicao.linha, coluna : celula.posicao.coluna, tiro : player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro, tipo : player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo, playerAlvo : player.username });                    
                }else if(player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo == TipoCelula.Navio){
                    player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo = TipoCelula.NavioComTiro
                   this.notifyAll('game', {linha : celula.posicao.linha, coluna : celula.posicao.coluna, tiro : player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tiro, tipo : player.tabuleiro.getCelula(celula.posicao.linha, celula.posicao.coluna).tipo, playerAlvo : player.username });                    
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

            client.on('game1', (board) => {              
                client.player.socketId = client.id;
              client.player.username = board.username;
                
               
              board.auxBarcos.forEach(barco => {
                  client.player.tabuleiro.adicionaNavio(barco.tipo, barco.orientacao, barco.linha, barco.coluna);
              });
                
               
                this.socketsIds.push(client.id);

               this.socketsIds.forEach(id =>{
                   let p: Player = new Player();
                   p.username = this.io.sockets.sockets[id].player.username;
                   p.socketId = this.io.sockets.sockets[id].player.socketId;
                   p.tabuleiro = this.io.sockets.sockets[id].player.tabuleiro;
                   this.players.push(p);

               })

                 client.emit('game', 'Game is readdy');

            });

        });

    };

    public notifyAll = (channel: string, message: any) => {
        this.io.sockets.emit(channel, message);
    }; 

    public copiaBoard(tabToFill: Tabuleiro, tabSource: Tabuleiro ){       
        tabToFill.celulas = tabSource.celulas;
        tabToFill.navios = tabSource.navios;
        tabToFill.posicoesOcupadas = tabSource.posicoesOcupadas;

    }
};

export class Player{
   public game : Game;
    public tabuleiro : Tabuleiro;
    public socketId : string;
    public username: string;

    constructor(){
        this.game = new Game(1);
        this.tabuleiro = new Tabuleiro();
        this.username = '';
        this.socketId = '';
    }

}
