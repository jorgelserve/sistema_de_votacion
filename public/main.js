var socket = io.connect('http://port-8080.hola-mundo-jorgelserve208343.codeanyapp.com/', { 'forceNew': true });
moment.locale('es');

socket.on('messages', function (data) {
	console.log(data);
	render(data);
});

socket.on('board-ready', function (data) {
	console.log(data)
	swal(
		'Tarjeta conectada!',
		`ARDUINO ${data.board} conectada al puerto ${data.port}`,
		'success'
	)
	empty(document.getElementById('container')).innerHTML = ' <button id="button">toggle</button>'
	document.getElementById('button').addEventListener('click', function (e) {
		socket.emit('toggle-led', e)
	})
})

function addMessage(e) {
	var payload = {
		author: document.getElementById('username').value,
		text: document.getElementById('texto').value,
		date: new Date()
	};

	socket.emit('new-message', payload);
	document.getElementById('form').reset()
	return false;
}


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