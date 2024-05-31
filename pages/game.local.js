import { useState } from 'react';
import styles from '../styles/Home.module.css';
import confetti from 'canvas-confetti';

const GameLocal = ({ playerX, playerO, gameMode, difficulty, onGameEnd }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [score, setScore] = useState({ X: 0, O: 0 });

  const handleClick = (index) => {
    if (board[index] || winner) return;

    makeLocalMove(index, currentPlayer);
    if (gameMode === 'cpu' && currentPlayer === 'X') {
      setTimeout(() => cpuMove(), 500);
    }
  };

  const makeLocalMove = (index, symbol) => {
    const newBoard = [...board];
    newBoard[index] = symbol;
    setBoard(newBoard);
    setIsXNext(!isXNext);
    setCurrentPlayer(symbol === 'X' ? 'O' : 'X');

    const calculatedWinner = calculateWinner(newBoard);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
      triggerFireworks(calculatedWinner);
      updateScore(calculatedWinner);
      setTimeout(() => {
        if (score[calculatedWinner] === 2) {
          onGameEnd();
        } else {
          resetGame();
        }
      }, 2000);
    } else if (isBoardFull(newBoard)) {
      setTimeout(resetGame, 2000); // Delay para reiniciar o jogo em caso de empate
    }
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every(square => square !== null);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setCurrentPlayer('X');
    setWinner(null);
    document.getElementById('winnerText').classList.remove(styles.winnerText);
  };

  const triggerFireworks = (winnerName) => {
    const duration = 5 * 1000; // 5 segundos
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));

      confetti(Object.assign({}, defaults, {
        particleCount: particleCount / 2,
        spread: 120,
        origin: { x: 0.5, y: 0.5 },
        scalar: 1.2,
        colors: ['#bb0000', '#ffffff']
      }));
    }, 250);

    const winnerText = document.getElementById('winnerText');
    winnerText.textContent = `${winnerName} Wins! 🎉`;
    winnerText.classList.add(styles.winnerText);
  };

  const updateScore = (winner) => {
    setScore((prevScore) => ({
      ...prevScore,
      [winner]: prevScore[winner] + 1,
    }));
  };

  const cpuMove = () => {
    let emptyIndexes = [];
    board.forEach((cell, index) => {
      if (cell === null) emptyIndexes.push(index);
    });

    if (emptyIndexes.length > 0) {
      const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      makeLocalMove(randomIndex, 'O');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Jogo da Velha</h1>
      <h3 className={styles.playerName}>{`Jogador X: ${playerX}, Jogador O: ${playerO}`}</h3>
      <div className={styles.scoreboard}>
        <div className={styles.score}>X: {score.X}</div>
        <div className={styles.score}>O: {score.O}</div>
      </div>
      <div className={styles.board}>
        {board.map((cell, index) => (
          <div
            key={index}
            className={styles.cell}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      <div className={styles.status}>
        {winner 
          ? `Vencedor: ${winner}` 
          : `Próximo jogador: ${currentPlayer}`}
      </div>
      <div id="winnerText" className={styles.winnerText}></div>
    </div>
  );
};

export default GameLocal;