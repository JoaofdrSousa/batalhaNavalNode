import {GameValidator} from "./gameValidator";
import {Celula, TipoCelula} from "./celula";
import {Posicao} from "./posicao";

export enum TipoNavio {
    PortaAvioes, 
    Couracado,
    Cruzador, 
    ContraTorpedeiro, 
    Submarino
}

export enum Orientacao {
    Normal,      // Igual ao enunciado
    Roda90,
    Roda180,     // Só para Porta-Aviões
    Roda270,     // Só para Porta-Aviões
}

export class Navio{
// ------------------------------------------------------------------------------------------------
// Estrutura Interna da Classe
// ------------------------------------------------------------------------------------------------
    
    public posicao: Posicao;
    public tipoNavio: TipoNavio;
    public orientacao: Orientacao;
    public celulas: Celula[];
    public posicoesOcupadas: Posicao[];
    public posicoesVizinhas: Posicao[];

    // ------------------------------------------------------------------------------------------------
    // Interface Publica da classe - Membros Principais
    // ------------------------------------------------------------------------------------------------
    public constructor (tipo: TipoNavio, orientacao: Orientacao, linha: string, coluna: number){
        if (!GameValidator.verificaOrientacao(tipo, orientacao)){
            throw new Error('A orientação "' + orientacao + '" é inválida para os navios do tipo  "' + tipo + '".');
        }
        this.posicao = new Posicao(linha, coluna);
        if (!GameValidator.verificaLimites(tipo, orientacao, this.posicao)){
            throw new Error('O tipo de navio "' + tipo + '" na posição (' + linha + coluna + ') e orientação "' + orientacao + '" não cabe nos limites do tabuleiro')
        }         
        this.tipoNavio = tipo;
        this.orientacao = orientacao;
        this.celulas = [];
        this.posicoesOcupadas = this.calculaPosicoesOcupadas();
        this.preenchePosicoesVizinhas();
    }
    

    public addCelula(celula: Celula): void{
        if (!Posicao.existe(celula.posicao, this.posicoesOcupadas)){
            throw new Error('Não é possível adicionar a célula ao navio.');
        }
        if (Celula.existe(celula, this.celulas)) {
            throw new Error('Não é possível adicionar a célula ao navio, porque já existe uma célula na mesma posição.');
        }
        if (celula.pertenceA != null){
            throw new Error('Não é possível adicionar a célula ao navio, porque já está associada a outro navio.');
        }      

        //retirar coment      
        celula.pertenceA = this;
        celula.tipo = TipoCelula.Navio; 
        this.celulas.push(celula);
    }

    public totalTiros(): number {
        let total = 0;
        this.celulas.forEach(value => {
            value.tiro ? total++ : null;
        });
        return total;
    }
    
    public afundou(): boolean {
        return this.totalTiros() == Navio.totalCelulasPorTipoNavio(this.tipoNavio);
    }

// ------------------------------------------------------------------------------------------------
// Métodos estátios auxiliares
// ------------------------------------------------------------------------------------------------

   // Devolve o total de celulas que um tipo de navio tem
    public static totalCelulasPorTipoNavio(tipo: TipoNavio): number {
        switch (tipo) {
            case TipoNavio.PortaAvioes: return 5;
            case TipoNavio.Couracado: return 4;
            case TipoNavio.Cruzador: return 3;
            case TipoNavio.ContraTorpedeiro: return 2;
            case TipoNavio.Submarino: return 1;
        }
        return 0;
    }

    private calculaPosicoesOcupadas(): Posicao[]{
        if (this.tipoNavio == TipoNavio.Submarino){
            return [new Posicao(this.posicao.linha, this.posicao.coluna)];
        }
        switch (this.orientacao) {
            case Orientacao.Normal:
                switch (this.tipoNavio) {
                    case TipoNavio.ContraTorpedeiro:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linha, this.posicao.coluna+1)
                            ];     
                    case TipoNavio.Cruzador:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linha, this.posicao.coluna+1),
                            new Posicao(this.posicao.linha, this.posicao.coluna+2)
                            ];     
                    case TipoNavio.Couracado:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linha, this.posicao.coluna+1),
                            new Posicao(this.posicao.linha, this.posicao.coluna+2),
                            new Posicao(this.posicao.linha, this.posicao.coluna+3)
                            ];     
                    case TipoNavio.PortaAvioes:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linha, this.posicao.coluna+1),
                            new Posicao(this.posicao.linha, this.posicao.coluna+2),
                            new Posicao(this.posicao.linhaAsNumber()+1, this.posicao.coluna+1),
                            new Posicao(this.posicao.linhaAsNumber()+2, this.posicao.coluna+1),
                            ];     
                }
                break;
            case Orientacao.Roda90:
                switch (this.tipoNavio) {
                    case TipoNavio.ContraTorpedeiro:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linhaAsNumber()+1, this.posicao.coluna)
                            ];     
                    case TipoNavio.Cruzador:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linhaAsNumber()+1, this.posicao.coluna),
                            new Posicao(this.posicao.linhaAsNumber()+2, this.posicao.coluna)
                            ];     
                    case TipoNavio.Couracado:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linhaAsNumber()+1, this.posicao.coluna),
                            new Posicao(this.posicao.linhaAsNumber()+2, this.posicao.coluna),
                            new Posicao(this.posicao.linhaAsNumber()+3, this.posicao.coluna)
                            ];     
                    case TipoNavio.PortaAvioes:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linhaAsNumber()+1, this.posicao.coluna),
                            new Posicao(this.posicao.linhaAsNumber()+2, this.posicao.coluna),
                            new Posicao(this.posicao.linhaAsNumber()+1, this.posicao.coluna-1),
                            new Posicao(this.posicao.linhaAsNumber()+1, this.posicao.coluna-2),
                            ];     
                }
                break;
            case Orientacao.Roda180:
                switch (this.tipoNavio) {
                    case TipoNavio.PortaAvioes:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linha, this.posicao.coluna-1),
                            new Posicao(this.posicao.linha, this.posicao.coluna-2),
                            new Posicao(this.posicao.linhaAsNumber()-1, this.posicao.coluna-1),
                            new Posicao(this.posicao.linhaAsNumber()-2, this.posicao.coluna-1),
                            ];     
                }
                break;
            case Orientacao.Roda270:
                switch (this.tipoNavio) {
                    case TipoNavio.PortaAvioes:
                        return [
                            new Posicao(this.posicao.linha, this.posicao.coluna), 
                            new Posicao(this.posicao.linhaAsNumber()-1, this.posicao.coluna),
                            new Posicao(this.posicao.linhaAsNumber()-1, this.posicao.coluna+1),
                            new Posicao(this.posicao.linhaAsNumber()-1, this.posicao.coluna+2),
                            new Posicao(this.posicao.linhaAsNumber()-2, this.posicao.coluna),
                            ];     
                }
            }
        throw new Error("Houve um erro ao calcular as posições do navio");       
    }
    
    private preenchePosicoesVizinhas(): void{
        let vizinhas: Posicao[] = [];
        this.posicoesOcupadas.forEach(p => {
            let linhaInf= p.linhaAsNumber()-1;
            let linhaSup= linhaInf + 2;
            let colunaInf = p.coluna-1;
            let colunaSup = colunaInf+2;
            linhaInf = linhaInf < 1  ? 1  : linhaInf;
            linhaSup = linhaSup > 10 ? 10 : linhaSup; 
            colunaInf = colunaInf < 1  ? 1  : colunaInf;
            colunaSup = colunaSup > 10 ? 10 : colunaSup;
            for (let i: number= linhaInf; i<= linhaSup; i++)
                for (let j: number= colunaInf; j<= colunaSup; j++) {
                    vizinhas.push(new Posicao(i,j));
                } 
        });
        // Extrair posições repetidas do array
        this.posicoesVizinhas = Posicao.removeRepetidos(vizinhas);
   }
}