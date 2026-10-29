import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const s = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    s.on('connect', () => {
      setConnected(true);
    });

    s.on('disconnect', () => {
      setConnected(false);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const joinShow = (showId) => {
    if (socket && showId) {
      socket.emit('joinShow', { showId });
    }
  };

  const leaveShow = (showId) => {
    if (socket && showId) {
      socket.emit('leaveShow', { showId });
    }
  };

  const lockSeat = (showId, seatNumber, userId) => {
    if (socket) {
      socket.emit('lockSeat', { showId, seatNumber, userId });
    }
  };

  const unlockSeat = (showId, seatNumber, userId) => {
    if (socket) {
      socket.emit('unlockSeat', { showId, seatNumber, userId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        joinShow,
        leaveShow,
        lockSeat,
        unlockSeat
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

