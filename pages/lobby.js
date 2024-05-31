import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from '../styles/Home.module.css';

const socket = io('http://localhost:3001');

const Lobby = ({ onStartGame }) => {
  const [room, setRoom] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [rooms, setRooms] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('roomCreated', ({ room, playerName, symbol }) => {
      setMessage(`Sala ${room} criada. Aguardando outro jogador...`);
      onStartGame(room, playerName, symbol);
    });

    socket.on('joinedRoom', ({ room, playerName, symbol }) => {
      setMessage(`Entrou na sala ${room}. Aguardando outro jogador...`);
      onStartGame(room, playerName, symbol);
    });

    socket.on('playerJoined', (count) => {
      if (count === 2) {
        setMessage('Outro jogador entrou. Iniciando o jogo...');
      }
    });

    socket.on('roomFull', () => {
      setMessage('Sala cheia. Por favor, escolha outro nome de sala.');
    });

    socket.on('updateRooms', (rooms) => {
      console.log('Rooms updated:', rooms); // Debug: log the updated rooms
      setRooms(rooms);
    });

    return () => {
      socket.off('roomCreated');
      socket.off('joinedRoom');
      socket.off('playerJoined');
      socket.off('roomFull');
      socket.off('updateRooms');
    };
  }, []);

  const handleCreateRoom = () => {
    if (room.trim() !== '' && playerName.trim() !== '') {
      socket.emit('createRoom', { room, playerName });
    } else {
      setMessage('Por favor, insira o nome da sala e seu nome.');
    }
  };

  const handleJoinRoom = (room) => {
    if (playerName.trim() !== '') {
      socket.emit('joinRoom', { room, playerName });
    } else {
      setMessage('Por favor, insira seu nome.');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Jogo da Velha - Lobby</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Nome da Sala"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Seu Nome"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Criar Sala</button>
      </div>
      {message && <p>{message}</p>}
      <div className={styles.roomList}>
        <h2>Salas Disponíveis</h2>
        {Object.keys(rooms).length > 0 ? (
          <div className={styles.roomGrid}>
            {Object.keys(rooms).map((room) => (
              <div key={room} className={styles.roomCard}>
                <h3>{rooms[room].name}</h3>
                <p>Jogadores: {rooms[room].players.map(player => player.name).join(', ')}</p>
                <p>Placar: X - {rooms[room].scores.X}, O - {rooms[room].scores.O}</p>
                {rooms[room].players.length < 2 && (
                  <button onClick={() => handleJoinRoom(room)}>Entrar na Sala</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhuma sala disponível no momento.</p>
        )}
      </div>
    </div>
  );
};

export default Lobby;
