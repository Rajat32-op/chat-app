
import { Server } from "socket.io";

const io = new Server(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}); // Start the Socket.IO server on port 3000

var users = []
io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("setname", (name) => {
        socket.username = name

    })
    // Handle events from the client
    // Disconnect event
    socket.on("disconnect", () => {

        if (socket.username !== null) {
            users = users.filter((obj) => { return obj.name !== socket.username })
            socket.broadcast.emit("response", "has left the chat", socket.username, "centre")
        }
    });

    socket.on('login', (name) => {
        if (name !== null) {
            socket.emit('load-page')
            users.push({ name: name })
            socket.broadcast.emit("response", "has joined the chat", name, "centre")
        }
    })
    socket.on("page2-reload", (name) => {
        users = users.filter((obj) => { return obj.name !== name })
        socket.emit("redirect-to-page1")
    })
    socket.on("message", (msg, name) => {

        if (name !== null) {

            socket.broadcast.emit("response", msg, name, "left")
            socket.emit("response", msg, "You", "right")
        }
    })
    socket.on("ask-members", () => {
        socket.emit("recieve-members", users)
    })
});
