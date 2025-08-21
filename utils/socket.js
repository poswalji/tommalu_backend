import { Server } from "socket.io";

export const initSocket = (server, opts = {}) => {
  const io = new Server(server, opts);

  io.on("connection", (socket) => {
    // Client should emit 'join' with type and id to join rooms
    socket.on("join", ({ type, id }) => {
      if (type === "restaurant") socket.join(`restaurant_${id}`);
      if (type === "user") socket.join(`user_${id}`);
    });

    socket.on("disconnect", () => {});
  });

  return io;
};
