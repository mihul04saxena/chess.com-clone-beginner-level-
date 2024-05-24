import { WebSocket } from "ws";
import {Chess} from "chess.js";
import {GAME_OVER, MOVE, INIT_GAME} from "./messages";

export class Game {

    public player1: WebSocket;
    public player2: WebSocket;
    public board: Chess;
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket){
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.player1.send(JSON.stringify({
        type: INIT_GAME,
        payload: {
            color: "white"
        }
    }));
    this.player2.send(JSON.stringify({
        type: INIT_GAME,
        payload: {
            color: "black"
        }
    }));
    }

    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }){
        //validate the type of move using zod
        if(this.moveCount % 2 === 0 && socket !== this.player1){
            return;
        }
        if(this.moveCount % 2 === 1 && socket !== this.player2){
            return;
        }

        console.log("Did not early Return");
        try{
            this.board.move(move);//Chess.js will take care for validating the move 
        }catch(e){
            console.log(e);
            return;
        }
        console.log("Move Succeeded");
        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                typr: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "white" : "black"
                }
            }));
            return;
        }
        console.log(this.board.moves().length % 2);
        if(this.board.moves().length % 2 === 0){
            console.log("sent1");
            this,this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }else{
            console.log("sent2");
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }

        this.moveCount++;

        //Update the board
        //Push the move

        //Check if the game is over

        //Send th eupdated board to both players
    }
}