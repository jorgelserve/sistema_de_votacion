var socket = io.connect('http://localhost:8080', { 'forceNew': true });
moment.locale('es');

socket.on('messages', function (data) {
	console.log(data);
	render(data);
});

socket.on('board-ready', function (data) {
	empty(document.getElementById('container'))
	swal(
		'Tarjeta conectada!',
		`ARDUINO ${data.board} conectada al puerto ${data.port}`,
		'success'
	)
	document.getElementById('container').innerHTML = `<div style="text-align: center;">
		<button class="button" id="iniciar">Iniciar</button>
		<button class="button" id="continuar">Continuar</button>
	</div>`
})

document.getElementById('iniciar').addEventListener('click', function () {
	socket.emit('start', null)
})

socket.on('locked', function (data) {
	data ? document.body.style.backgroundColor = 'red' : document.body.style.backgroundColor = 'initial'
})

socket.on('voted', function (data) {
	document.getElementById('container').innerHTML = `<h1 style="text-align: center;">${data}</h1>`
	console.log(data)
})

socket.on('down', function (data) {
	console.log(data)
})

function empty(element) {
	if (!(element instanceof HTMLElement)) {
		throw new TypeError('Expected an element')
	}

	var node
	while ((node = element.lastChild)) element.removeChild(node)
	return element
}

function startTime() {
	document.getElementById('header').innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a')
	var t = setTimeout(startTime, 500);
}