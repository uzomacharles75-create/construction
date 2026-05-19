// apps/api/src/server.ts
import dotenv from 'dotenv';
dotenv.config(); // MUST BE AT THE VERY TOP

import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import { backfillMissingCompanySlugs } from './utils/companySlug';

const server = http.createServer(app);

// 1. Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// 2. Database Connection
const dbUri = process.env.MONGO_URI;
if (!dbUri) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose.connect(dbUri)
  .then(async () => {
    console.log("✅ BuildHub DB Connected Successfully");
    await backfillMissingCompanySlugs();
  })
  .catch((err) => console.error("❌ DB Error:", err.message));

// 3. Real-time Comms
io.on('connection', (socket) => {
  console.log(`👤 Connected: ${socket.id}`);

  socket.on('join_room', (userId: string) => {
    socket.join(userId);
    console.log(`🏠 Room Joined: ${userId}`);
  });

  socket.on('send_message', (data) => {
    if (data.receiverId) {
      io.to(data.receiverId).emit('receive_message', data);
    }
  });

  socket.on('disconnect', () => console.log(`🔌 Disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 BuildHub API v4.0 LIVE on port ${PORT}`);
});