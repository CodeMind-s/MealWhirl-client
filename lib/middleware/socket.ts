import { io } from 'socket.io-client';


// const socket = io(process.env.NEXT_PUBLIC_API_URL_SOCKET); // Adjust the URL to your backend
const socket = io("ws://localhost:4000?orderId=6822fb47dc8d1658a9850279"); // Adjust the URL to your backend

export default socket;