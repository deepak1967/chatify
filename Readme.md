
# 💬 Real-Time Chat App

A real-time chat application built using **Angular** (frontend) and **Node.js with Socket.IO** (backend). This app allows users to send and receive messages instantly over WebSocket.

---

## 🚀 Features

- Live real-time chat using WebSocket (Socket.IO)
- Broadcast messaging to all connected clients
- User connection/disconnection tracking
- Modular and clean code structure
- CORS-enabled for local development

---

## 🛠️ Tech Stack

| Technology   | Description                |
|--------------|----------------------------|
| Angular      | Frontend Framework         |
| Node.js      | Backend Runtime            |
| Express.js   | Web server for APIs        |
| Socket.IO    | Real-time communication    |
| RxJS         | Reactive programming (Angular) |

---

## 📁 Project Structure

```
realtime-chat-app/
├── client/                   # Angular frontend
│   ├── src/app/socket.service.ts
│   └── ...
├── server/                   # Node.js backend
│   ├── server.js
│   └── ...
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/realtime-chat-app.git
cd realtime-chat-app
```

### 2. Setup Backend (Node.js + Socket.IO)

```bash
cd server
npm install
node server.js
```

By default, server runs at `http://localhost:3000`

### 3. Setup Frontend (Angular)

```bash
cd ../client
npm install
ng serve
```

Angular app runs at `http://localhost:4200`

---

## 💡 Usage

- Open `http://localhost:4200` in multiple browser windows/tabs
- Type a message and send — it will be broadcasted to all clients
- Check the console for connection logs

---

## 📷 Screenshots

> _Add screenshots here if needed (UI preview, message logs, etc.)_

---

## 📌 Notes

- Make sure both frontend and backend are running simultaneously.
- WebSocket connections require matching port and CORS setup between Angular (4200) and Node.js (3000).
- Socket.IO versions must be compatible (use v4.x on both client and server if possible).

---

## 📃 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

- [Socket.IO Documentation](https://socket.io/docs/)
- [Angular](https://angular.io/)
- [Node.js](https://nodejs.org/)