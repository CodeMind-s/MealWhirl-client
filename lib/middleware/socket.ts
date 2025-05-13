
export const createWebSocketConnection = (orderId: string) => {
    return new WebSocket(`ws://localhost:4000?orderId=${orderId}`);
  };