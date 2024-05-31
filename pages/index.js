import { useState } from 'react';
import GameLocal from './game.local';
import GameOnline from './game.online';
import Lobby from './lobby';
import styles from '../styles/Home.module.css';

const Home = () => {
  const [playerX, setPlayerX] = useState('');
  const [playerO, setPlayerO] = useState('');
  const [gameMode, setGameMode] = useState('player'); // 'player' or 'cpu'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
  const [startGame, setStartGame] = useState(false);
  const [onlineMode, setOnlineMode] = useState(false);
  const [room, setRoom] = useState('');
  const [player, setPlayer] = useState('');

  const handleStartGame = () => {
    if (playerX && (playerO || gameMode === 'cpu')) {
      setStartGame(true);
    } else {
      alert('Por favor, insira os nomes dos jogadores.');
    }
  };

  const handleOnlineMode = () => {
    setOnlineMode(true);
  };

  const handleOnlineStartGame = (room, playerName, symbol) => {
    setRoom(room);
    setPlayer({ name: playerName, symbol });
    setStartGame(true);
  };

  const resetToMenu = () => {
    setStartGame(false);
    setOnlineMode(false);
    setPlayerX('');
    setPlayerO('');
    setGameMode('player');
    setDifficulty('easy');
    setRoom('');
    setPlayer('');
  };

  if (startGame) {
    if (onlineMode) {
      return <GameOnline room={room} playerName={player.name} symbol={player.symbol} onGameEnd={resetToMenu} />;
    } else {
      return <GameLocal playerX={playerX} playerO={playerO} gameMode={gameMode} difficulty={difficulty} onGameEnd={resetToMenu} />;
    }
  }

  if (onlineMode) {
    return <Lobby onStartGame={handleOnlineStartGame} />;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Jogo da Velha</h1>
      <div className={styles.inputContainer}>
        <input 
          type="text" 
          placeholder="Nome do Jogador X" 
          value={playerX} 
          onChange={(e) => setPlayerX(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Nome do Jogador O" 
          value={playerO} 
          onChange={(e) => setPlayerO(e.target.value)} 
          disabled={gameMode === 'cpu'}
        />
        <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
          <option value="player">Contra outro jogador</option>
          <option value="cpu">Contra CPU</option>
        </select>
        {gameMode === 'cpu' && (
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Fácil</option>
            <option value="medium">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        )}
        <button onClick={handleStartGame}>Iniciar Jogo</button>
        <button onClick={handleOnlineMode}>Modo Online</button>
      </div>
    </div>
  );
};

export default Home;
