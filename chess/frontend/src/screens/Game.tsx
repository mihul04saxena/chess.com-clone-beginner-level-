import { ChessBoard } from '../components/ChessBoard';
import { Button} from '../components/Button';
import { useSocket } from '../hooks/useSocket';
import { useEffect, useState } from 'react';
import {Chess} from 'chess.js'

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board()) ;
    const [started, setStarted] = useState(false);
    useEffect(() =>{
        if(!socket){
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch(message.type){
                case INIT_GAME:
                    // setChess(new Chess());
                    setBoard(chess.board());
                    setStarted(true);
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    break;
            }
        }
    }, [socket]);

    if(!socket) return <div>Connectnig...</div>

  return <main className="justify-center flex">
      <section className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-6 gap-4 w-full">
          <div className="col-span-4 w-full">
            <ChessBoard chess = {chess} setBoard = {setBoard} socket = {socket} board = {board}/>
          </div>
          <div className="col-span-2 flex flex-col items-center bg-slate-900 p-4 rounded-md">
          {!started && < Button onClick = {() =>{
                        socket.send(JSON.stringify({
                            type: INIT_GAME
                        }))
                    }}>Play Online </Button>}
          </div>
        </div>
      </section>
    </main>
  
};