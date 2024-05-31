const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let rooms = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createRoom', ({ room, playerName }) => {
    console.log(`Creating room: ${room} for player: ${playerName}`);
    if (!rooms[room]) {
      rooms[room] = { players: [], scores: { X: 0, O: 0 }, name: room, currentPlayer: 'X' };
      rooms[room].players.push({ id: socket.id, name: playerName, symbol: 'X' });
      socket.join(room);
      socket.emit('roomCreated', { room, playerName, symbol: 'X' });
      io.emit('updateRooms', rooms);
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('joinRoom', ({ room, playerName }) => {
    console.log(`Joining room: ${room} for player: ${playerName}`);
    if (rooms[room] && rooms[room].players.length < 2) {
      const symbol = rooms[room].players.length === 1 ? 'O' : 'X';
      rooms[room].players.push({ id: socket.id, name: playerName, symbol });
      socket.join(room);
      io.to(room).emit('playerJoined', rooms[room].players.length);
      io.emit('updateRooms', rooms);
      socket.emit('joinedRoom', { room, playerName, symbol });
    } else {
      socket.emit('roomFull');
    }
  });

  socket.on('move', (data) => {
    console.log(`Move in room ${data.room}: ${data.symbol} to index ${data.index}`);
    rooms[data.room].currentPlayer = data.symbol === 'X' ? 'O' : 'X';
    io.to(data.room).emit('moveMade', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    for (let room in rooms) {
      rooms[room].players = rooms[room].players.filter(player => player.id !== socket.id);
      if (rooms[room].players.length === 0) {
        delete rooms[room];
      } else {
        io.to(room).emit('playerJoined', rooms[room].players.length);
      }
    }
    io.emit('updateRooms', rooms);
  });
});

server.listen(3001, () => {
  console.log('Listening on *:3001');
});
