import {Navio} from "./navio";
import {Celula, TipoCelula} from "./celula";
import {TipoNavio} from "./navio";
import {Orientacao} from "./navio";
import {Posicao} from "./posicao";

export class Tabuleiro {
    // ------------------------------------------------------------------------------------------------
    // Interface Publica da classe - Membros Principais
    // ------------------------------------------------------------------------------------------------


    //Propriedade com todos as navios do tabuleiro
    public navios: Navio[];

    //Propriedade com todas as celulas do tabuleiro
    public celulas: Celula[];

    //Propriedade com todas as posições já ocupadas (incluindo a vizinhança dos navios)
    public posicoesOcupadas: Posicao[];

    constructor (){
        this.celulas = [];
        this.posicoesOcupadas = [];
        this.navios= [];
        Tabuleiro.todasLinhas().forEach(letra=> {
            Tabuleiro.todasColunas().forEach(coluna =>{
                let c: Celula = new Celula(letra, coluna);
                this.celulas.push(c);
                
            });
        });
    }

    // Devolve a célula que está na posição linha, coluna
    public getCelula(linha: string, coluna: number): Celula{
        console.log('get celula');
        console.log(linha);
        console.log(coluna);
        let posicao: Posicao = new Posicao(linha, coluna);
        console.log(posicao);
        console.log(this.celulas);
        return this.celulas[posicao.linhaIndex() * 10 + posicao.colunaIndex()];
    }

    public adicionaNavio(tipo: TipoNavio, orientacao: Orientacao, linha: string, coluna: number): Navio{
        try {
            let navio: Navio = new Navio(tipo, orientacao, linha, coluna);
            if (Posicao.conflito(navio.posicoesOcupadas, this.posicoesOcupadas)){
                throw new Error('O navio "' + tipo + '" na posição (' + linha + coluna + ') e orientação "' + orientacao + '" está em sobreposição ou encostado a um navio já existente')
            }
            navio.posicoesOcupadas.forEach(p => {
                navio.addCelula(this.getCelula(p.linha, p.coluna));
            });
            this.posicoesOcupadas = Posicao.merge(this.posicoesOcupadas, navio.posicoesVizinhas);
            this.navios.push(navio);
            return navio;
        } 
        catch (e){
            // Alterar para fazer tratamento de erros
            throw e;
        }
    }

    // Devolve as células na forma de matriz - usar só para testes (performance inferior à propriedade celulas)
    public celulasMatrix(): Celula[][] {
        let c: Celula[][] = [];    
        Tabuleiro.todasLinhas().forEach(linha =>{
            let l: Celula[] = [];
            Tabuleiro.todasColunas().forEach(coluna =>{
                l.push(this.getCelula(linha, coluna))
            });
            c.push(l);
        });
        return c;
    }

        // Devolve a célula que está na posição linha, coluna
    public limpaRefCirc(){
        this.celulas.forEach(celula=>{
            celula.pertenceA = null;
        })
    }
    
    // ------------------------------------------------------------------------------------------------
    // Métodos estátios auxiliares
    // ------------------------------------------------------------------------------------------------

    public static todasLinhas(): string[]{
        return ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    }  

    public static todasColunas(): number[]{
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }      
}