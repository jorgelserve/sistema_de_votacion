const express = require('express')
const app = express()
const server = require('http').Server(app)
var messages = [{
		text: 'Soy un mensaje',
		author: '@jorgelserve',
		date: new Date()
}]

const io = require('socket.io')(server)

app.use(express.static('public'))

app.get('/', function (req, res) {
	res.status(200).send("Hola mun")
})

io.on('connection', function (socket) {
	console.log(`alguien se ha conectado con sockets`)
	socket.emit('messages', messages)

	socket.on('new-message', function (data) {
		messages.push(data)
		io.sockets.emit('messages', messages)
	})
})


var port = process.env.PORT || 8080
server.listen(port, () => console.log(`escuchando en el puerto ${port}`))