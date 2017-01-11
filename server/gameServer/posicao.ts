import {GameValidator} from "./gameValidator";

export class Posicao{
    public linha: string;

    public coluna: number;

    // Exemplos: A3; H10; A1; ...
    public strValue(): string{
        return this.linha + this.coluna;
    }

    public constructor(linha: string|number, coluna: number){
        let linhaLetra : string;
        if (typeof linha === "string"){
            linhaLetra = linha[0];
        }
        else {
            linhaLetra = String.fromCharCode('A'.charCodeAt(0) + linha - 1);
        }
        if (!GameValidator.verificaColuna(coluna)){
            throw new Error('Valor da coluna "' + coluna + '" é inválido');
        }
        if (!GameValidator.verificaLinha(linhaLetra)){
            throw new Error('Valor da linha "' + linhaLetra + '" é inválido');
        }
        this.linha = linhaLetra;
        this.coluna = coluna;
    }

    // A=1; B=2; ...
    public linhaAsNumber(): number{
        return this.linha.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    }

    // index a começar em zero (A=0; B=1)
    public linhaIndex(): number{
        return this.linhaAsNumber()-1;
    }

    // index a começar em zero (Coluna1=0; Coluna2=1)
    public colunaIndex(): number{
        return this.coluna-1;
    }

    public sobreposicao(p: Posicao){
        return (p.linha == this.linha) && (p.coluna == this.coluna); 
    }

    // Extrair posições repetidas de um array
    public static removeRepetidos(posicoes: Posicao[]): Posicao[] {
        let result: Posicao[] = [];
        for (let i: number= 0; i< posicoes.length; i++) {
            if (!Posicao.existe(posicoes[i], result)){
                result.push(posicoes[i]);
            }
        }
        return result;
    }

    // Faz o merge de 2 arrays de Posicoes e retira os repetidos
    public static merge(posicoes1: Posicao[], posicoes2: Posicao[]): Posicao[] {
        let result: Posicao[] = posicoes1;
        result = result.concat(posicoes2);
        return Posicao.removeRepetidos(result);
    }        

    // Verifica se uma determinada posição existe num array
    public static existe(posicao: Posicao, arrayPosicoes: Posicao[]): boolean {
        for (let i: number= 0; i< arrayPosicoes.length; i++) {
            if (posicao.sobreposicao(arrayPosicoes[i])) {
                return true;
            }
        }
        return false;
    }        

    // Verifica se existe algum conflito entre 2 arrays de posições
    // Considera-se que há conflito, se pelo menos uma posição aparecer nos 2 arrays
    public static conflito(arrayPosicoes1: Posicao[], arrayPosicoes2: Posicao[]): boolean {
        for (let i: number= 0; i< arrayPosicoes1.length; i++) {
            if (Posicao.existe(arrayPosicoes1[i], arrayPosicoes2)){
                return true;
            }
        }
        return false;
    }        


            
}