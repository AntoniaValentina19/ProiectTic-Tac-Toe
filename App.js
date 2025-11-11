import { useState } from 'react';

// === Componenta Square (Casuta) ===
function Square({ value, onSquareClick, isWinningSquare }) {
  const className = `square ${isWinningSquare ? 'winning-square' : ''}`;
  
  return (
    <button className={className} onClick={onSquareClick}>
      {value && (
        <span className={`square-content ${value === 'X' ? 'content-x' : 'content-o'}`}>
          {value}
        </span>
      )}
    </button>
  );
}

// === Componenta Board (Tabla de joc) ===
// Am adaugat onReset
function Board({ xIsNext, squares, onPlay, onReset }) { 
  const { winner, winningLine } = calculateWinner(squares);

  function handleClick(i) {
    if (winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  let statusText;
  let statusClassName = "status"; 
  const isDraw = !winner && squares.every(square => square !== null);
  const isGameOver = winner || isDraw;
  
  // Determinarea stării și a culorii
  if (winner) {
    if (winner === 'X') {
      statusClassName += ' status-x-winner status-winner-animate';
      statusText = `Câștigător: X! 🔥 FELICITARI 🎊 `;
    } else {
      statusClassName += ' status-o-winner status-winner-animate';
      statusText = `Câștigător: O! 🎉 FELICITĂRI! 🎊`;
    }
  } else if (isDraw) {
    statusText = 'Egalitate! 🤝 Jocul s-a terminat.';
  } else {
    statusText = 'Următorul jucător: ' + (xIsNext ? 'X' : 'O');
    statusClassName += xIsNext ? ' status-x-next' : ' status-o-next';
  }

  // Generarea dinamică a tablei de joc (3x3)
  const board = Array(3).fill(null).map((_, row) => (
    <div key={row} className="board-row">
      {Array(3).fill(null).map((_, col) => {
        const i = row * 3 + col;
        const isWinningSquare = winningLine && winningLine.includes(i);
        
        return (
          <Square 
            key={i} 
            value={squares[i]} 
            onSquareClick={() => handleClick(i)} 
            isWinningSquare={isWinningSquare}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className={statusClassName}>
        <span>{statusText}</span>
        {/* BUTON NOU: Afișează doar la sfârșitul jocului */}
        {isGameOver && (
            <button onClick={onReset} className="reset-button">
                Începe Joc Nou
            </button>
        )}
      </div> 
      {board}
    </>
  );
}

// === Componenta Game (Jocul principal) ===
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Functia de reset
  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }
  
  return (
    <div className="game">
        <h1>Tic-Tac-Toe 🔥</h1>
      <div className="game-board">
        {/* Am transmis onReset ca prop */}
        <Board 
            xIsNext={xIsNext} 
            squares={currentSquares} 
            onPlay={handlePlay} 
            onReset={handleReset} 
        />
      </div>
      {/* Istoricul a fost eliminat */}
    </div>
  );
}

// === Functia de Logica (calculateWinner) ===
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: [a, b, c] }; 
    }
  }
  
  return { winner: null, winningLine: null };
}