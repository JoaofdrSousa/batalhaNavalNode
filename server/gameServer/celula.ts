import {Navio} from "./navio";
import {Posicao} from "./posicao";

export enum TipoCelula{
    Mar,
    Navio,
    MarComTiro,
    NavioComTiro
}

export class Celula{
    public posicao: Posicao;
    public tipo: TipoCelula;
    public tiro: Boolean;
    public pertenceA: Navio;
    public constructor (linha: string, coluna: number){
        this.posicao = new Posicao(linha, coluna);
        this.tipo = TipoCelula.Mar;
        this.tiro = false;
        this.pertenceA = null;
    }

    public sobreposicao(c: Celula){
        return (c.posicao.linha == this.posicao.linha) && (c.posicao.coluna == this.posicao.coluna); 
    }
    
    // Verifica se uma determinada celula existe num array
    public static existe(celula: Celula, arrayCelulas: Celula[]): boolean {
        for (let i: number= 0; i< arrayCelulas.length; i++) {
            if (celula.sobreposicao(arrayCelulas[i])) {
                return true;
            }
        }
        return false;
    }            
}
