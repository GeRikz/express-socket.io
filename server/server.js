import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import mysql from 'mysql2';
import dotenv from 'dotenv'
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../client'));
app.set('view engine', 'ejs');

app.use("/", (req, res) => {
  res.render("../client/index.ejs",{});
});

const server = http.createServer(app);
const io = new Server(server);
//mysql example from .env file
/*
const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
}).promise()

async function getUsers(id){
	const [result] = await pool.query(`SELECT * FROM users WHERE authID = ?`,[id])
	return result[0]
}

async function createUser(id,username,avatar){
	const [result] = await pool.query(`INSERT INTO users (authID,username,avatar,lastseen) VALUES (?,?,?,?)`,[id,username,avatar,Math.floor(Date.now() / 1000)])
	return result.insetID
}
*/
io.on('connection', async socket => {
	
    socket.on('joinRoom', function (data) {
		socket.join(`room${data.roomId}`);
		io.to(`room${data.roomId}`).emit(`receiveMSG`,`${socket.id} joined room ${data.roomId}`);
    })
	
	socket.on('sendMsg', function(msg){
		console.log(socket.rooms)
		var rooms = Array.from(socket.rooms);
		console.log(rooms)
		for (var i = 1; i < rooms.length; i++) {
			console.log(rooms[i])
			io.to(rooms[i]).emit('received-msg', { id: socket.id, msg: msg.msg });
		}
	});
})
setInterval(() => {
var currentdate = new Date(); 
var datetime = 'Current time: ' + currentdate.getDate() + '/'
                + (currentdate.getMonth()+1)  + '/' 
                + currentdate.getFullYear() + ' @ '  
                + currentdate.getHours() + ':'  
                + currentdate.getMinutes() + ':' 
                + currentdate.getSeconds();
				io.emit('updateTime', datetime)
},1000)

server.listen(3000, () => {
  console.log(`server is running in localhost:3000`);
});
