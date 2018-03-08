const express = require('express')
const app = express()
const server = require('http').Server(app)
const five = require('johnny-five')
const board = new five.Board()
const io = require('socket.io')(server)

var flag = true
var votos = 0


app.use(express.static('public'))

app.get('/', function (req, res) {
	res.status(200).send('Hola mun')
})

board.on('ready', function() {
	var blanco = new five.Button(2)
	var led = new five.Led(13);
	io.on('connection', function (socket) {
		setTimeout(() => socket.emit('board-ready', {board: board.type , port: board.port}), 300)
		socket.on('start', function () {
			
		})
		blanco.on('press', function() {
			if(flag) {
				io.sockets.emit('locked', true)
				flag = !flag
				votos += 1
				io.sockets.emit('voted', votos)
				setTimeout(() => {
					flag = true
					io.sockets.emit('locked', false)
				}, 2000)
			}
		})



	})
})


//io.on('connection', function (socket) {
	// board.on('ready', function() {
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