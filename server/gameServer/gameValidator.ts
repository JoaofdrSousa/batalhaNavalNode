import {Tabuleiro} from "./tabuleiro";
import {TipoNavio} from "./navio";
import {Orientacao} from "./navio";
import {Posicao} from "./posicao";


export class GameValidator {
        // Verifica se os valores da coluna estão corretos
    public static verificaColuna(coluna: number): boolean{
        if ((coluna<1) || (coluna>10)){
            return false;
        }
        return true;
    }
    
    // Verifica se os valores da linha estão corretos
    public static verificaLinha(linha: string): boolean{
        return Tabuleiro.todasLinhas().indexOf(linha) > -1;
    }

    // Verifica se o valor da orientacao é adequado ao tipo de navio
    public static verificaOrientacao(tipo: TipoNavio, orientacao: Orientacao): boolean{
        switch (tipo) {
            case TipoNavio.PortaAvioes: 
                return true;
            case TipoNavio.Couracado:   
            case TipoNavio.Cruzador: 
            case TipoNavio.ContraTorpedeiro: 
                return (orientacao == Orientacao.Normal) || (orientacao == Orientacao.Roda90);
            case TipoNavio.Submarino: 
                return (orientacao == Orientacao.Normal);            
        }
    }

    // Verifica se um navio de um determinado tipo e com determinada orientação, cabe ou não dentro do tabuleiro
    public static verificaLimites(tipo: TipoNavio, orientacao: Orientacao, posicao: Posicao): boolean{
        console.log('VERIFICA LIMITES');
        console.log('Tipo = '+tipo);
        console.log('Orientacao = '+orientacao);
        console.log(typeof posicao.coluna);
        console.log('Posicao = '+posicao.strValue());

        if (tipo== TipoNavio.Submarino){
            return true;
        }
        let offsetVertical: number= 0;
        let offsetHorizontal: number= 0;
        switch (orientacao) {
            case Orientacao.Normal:
                switch (tipo) {
                    case TipoNavio.PortaAvioes:
                        offsetVertical= 2;
                        offsetHorizontal= 2;
                        break; 
                    case TipoNavio.Couracado: 
                        offsetHorizontal= 3;
                        break; 
                    case TipoNavio.Cruzador: 
                        offsetHorizontal= 2;
                        break; 
                    case TipoNavio.ContraTorpedeiro: 
                        offsetHorizontal= 1;
                        break; 
                }
                break;
            case Orientacao.Roda90:
                switch (tipo) {
                    case TipoNavio.PortaAvioes:
                        offsetVertical= 2;
                        offsetHorizontal= -2;
                        break; 
                    case TipoNavio.Couracado: 
                        offsetVertical= 3;
                        break; 
                    case TipoNavio.Cruzador: 
                        offsetVertical= 2;
                        break; 
                    case TipoNavio.ContraTorpedeiro: 
                        offsetVertical= 1;
                        break; 
                }
                break;
            case Orientacao.Roda180:
                if (tipo === TipoNavio.PortaAvioes){
                    offsetVertical= -2;
                    offsetHorizontal= -2;
                }
                else {
                    return false;
                }
                break;
            case Orientacao.Roda270:
                if (tipo === TipoNavio.PortaAvioes){
                    offsetVertical= -2;
                    offsetHorizontal= 2;
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
        
        if (((posicao.coluna + offsetHorizontal)<1) || ((posicao.coluna + offsetHorizontal)>10)){
            return false;
        }
        console.log("posicao.linhaAsNumber()");
        console.log(posicao.linhaAsNumber());
        console.log("offsetVertical");
        console.log(offsetVertical);

        if (((posicao.linhaAsNumber() + offsetVertical)<1) || ((posicao.linhaAsNumber() + offsetVertical)>10)){
            return false;
        }
       return true;
    }
}