export const initSocket = () => {

    const ws = new WebSocket(process.env.REACT_APP_BACKEND_URL);


    ws.onopen = () => {
        console.log('WebSocket connection established');
   
    };


    ws.onmessage = (event) => {
        console.log('Message from server:', event.data);
   
    };

 
    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };


    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return ws; 
};






// import { io } from 'socket.io-client';

// export const initSocket = async () => {
//     const options = {
//         'force new connection': true,
//         reconnectionAttempts: 'Infinity',
//         timeout: 10000,
//         transports: ['websocket'], // Try to connect via WebSocket
//     };
//     return io(process.env.REACT_APP_BACKEND_URL, options);
// };
