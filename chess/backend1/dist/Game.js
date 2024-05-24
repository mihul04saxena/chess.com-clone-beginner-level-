"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        //validate the type of move using zod
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }
        console.log("Did not early Return");
        try {
            this.board.move(move); //Chess.js will take care for validating the move 
        }
        catch (e) {
            console.log(e);
            return;
        }
        console.log("Move Succeeded");
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                typr: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "white" : "black"
                }
            }));
            return;
        }
        console.log(this.board.moves().length % 2);
        if (this.board.moves().length % 2 === 0) {
            console.log("sent1");
            this, this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            console.log("sent2");
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        this.moveCount++;
        //Update the board
        //Push the move
        //Check if the game is over
        //Send th eupdated board to both players
    }
}
exports.Game = Game;
