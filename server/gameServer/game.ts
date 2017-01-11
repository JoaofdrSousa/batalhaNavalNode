import {Tabuleiro} from "./tabuleiro";


export class Game{

	public tabuleiros: Tabuleiro[];

    constructor (numeroTabuleiro: number){
        this.tabuleiros = [];
		for (let i =0; i < numeroTabuleiro; i++) {
			let t : Tabuleiro = new Tabuleiro();
			this.tabuleiros.push(t);   
		}
	}

}