const express = require('express')
const app = express()
const server = require('http').Server(app)
const five = require('johnny-five')
const board = new five.Board()
const io = require('socket.io')(server)
const fs = require('fs')

var flag = true

app.use(express.static('public'))

app.get('/', function (req, res) {
	res.status(200).send('Hola mun')
})



board.on('ready', function() {
	var buttons = [
		new five.Button(2),
		new five.Button(3),
		new five.Button(4),
		new five.Button(5)
	]
	var led = new five.Led(13);
	io.on('connection', function (socket) {
		setTimeout(() => socket.emit('board-ready', {board: board.type , port: board.port}), 300)
		socket.on('check-password', function (data) {
			if(data == process.env.PASS) {
				let elecciones = {
					blanco: {
						votos: 0
					},
					candidato1: {
						votos: 0
					},
					candidato2: {
						votos: 0
					},
					candidato3: {
						votos: 0
					}
				}
				fs.writeFileSync('server/elecciones.json', JSON.stringify(elecciones, null, 4))
				// var db = JSON.parse(data)
			socket.emit('system-init', {
				pass: true,
				data: JSON.parse(fs.readFileSync('server/elecciones.json'))
			})
		}
			
		})
		socket.on('keep-going', function () {
			let datos = JSON.parse(fs.readFileSync('server/elecciones.json'))
			datos = datos.blanco.votos + datos.candidato1.votos + datos.candidato2.votos + datos.candidato3.votos
			socket.emit('keep-going', datos)
		})
		socket.on('start', function (data) {
			socket.emit('start', 'sistema iniciado')
		})

		buttons.forEach(function (button, index, array) {
			button.on('press', function () {
				if (flag) {
					let datos = JSON.parse(fs.readFileSync('server/elecciones.json'))
					switch(index) {
						case 0:
							datos.blanco.votos++
							break

						case 1:
							datos.candidato1.votos++
							break

						case 2:
							datos.candidato2.votos++
							break

						case 3:
							datos.candidato3.votos++
					}
					fs.writeFileSync('server/elecciones.json', JSON.stringify(datos, null, 4))
					io.sockets.emit('locked', true)
					flag = !flag
					io.sockets.emit('voted', datos.blanco.votos + datos.candidato1.votos + datos.candidato2.votos + datos.candidato3.votos)
					setTimeout(() => {
						flag = true
						io.sockets.emit('locked', false)
					}, 2000)
				}
			})
		})

		socket.on('checkpassword', function (data) {
			if (data == process.env.PASS) {
				socket.emit('checkpassword', true)
			} else {
				socket.emit('checkpassword', false)
			}
		})

		socket.on('end', function (data) {
			io.sockets.emit('end', JSON.parse(fs.readFileSync('server/elecciones.json')))
			setTimeout(() => process.exit(0), 1000)
		})

	})
})


var port = process.env.PORT || 8080

server.listen(port, () => console.log(`escuchando en el puerto ${port}`))