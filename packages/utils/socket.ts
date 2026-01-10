import io from 'socket.io-client';

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

const socket = io(serverUrl, {
  path: '/socket.io',
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  randomizationFactor: 0.5,
  timeout: 5000,
  transports: ['websocket'],
});

export default socket;
