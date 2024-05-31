import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const createRoom = (room, playerName) => {
  console.log(`Creating room: ${room} for player: ${playerName}`);
  socket.emit('createRoom', { room, playerName });
};

const joinRoom = (room, playerName) => {
  console.log(`Joining room: ${room} for player: ${playerName}`);
  socket.emit('joinRoom', { room, playerName });
};

const makeMove = (room, symbol, index) => {
  console.log(`Making move in room: ${room}, symbol: ${symbol}, index: ${index}`);
  socket.emit('move', { room, symbol, index });
};

const onMoveMade = (callback) => {
  socket.on('moveMade', (data) => {
    console.log('Move made received:', data);
    callback(data);
  });
};

const onPlayerJoined = (callback) => {
  socket.on('playerJoined', (count) => {
    console.log('Player joined:', count);
    callback(count);
  });
};

const offMoveMade = (callback) => {
  socket.off('moveMade', callback);
};

const offPlayerJoined = (callback) => {
  socket.off('playerJoined', callback);
};

export { createRoom, joinRoom, makeMove, onMoveMade, onPlayerJoined, offMoveMade, offPlayerJoined };
