const express = require('express')
const app = express()
const server = require('http').Server(app)
const five = require("johnny-five")
const board = new five.Board()

var messages = [
	{
		text: 'Soy un mensaje',
		author: '@jorgelserve',
		date: new Date()
	},
	{
		text: 'Soy un mensaje',
		author: '@jorgelserve',
		date: new Date(12,4, 1992)
	}
]

const io = require('socket.io')(server)

app.use(express.static('public'))

app.get('/', function (req, res) {
	res.status(200).send("Hola mun")
})


board.on("ready", function() {
	var led = new five.Led(13);
	io.on('connection', function (socket) {
		socket.emit('board-ready', {board: board.type , port: board.port})

		socket.on('toggle-led', function (data) {
			led.toggle()
		})
	})
})


//io.on('connection', function (socket) {
	// board.on("ready", function() {
	// 	socket.emit('boad-ready', {board: board.type , port: board.port} )
	// })
	// console.log(`alguien se ha conectado con sockets`)
	// socket.emit('messages', messages)

	// socket.on('new-message', function (data) {
	// 	messages.push(data)
	// 	io.sockets.emit('messages', messages)
	// })
//})

var port = process.env.PORT || 8080

server.listen(port, () => console.log(`escuchando en el puerto ${port}`))