var socket = io.connect('http://localhost:8080', { 'forceNew': true })
moment.locale('es')

socket.on('messages', function (data) {
	console.log(data)
	render(data)
})

function render(data) {
	var html = data.map(function (element, index) {
		return(`<div>
			<strong>${element.author}</strong>: 
			<em>${element.text}</em>
			<small>${moment(element.date).fromNow()}</small>
		</div>`)
	}).join(" ")
	document.getElementById('messages').innerHTML = html
}

function addMessage(e) {
	var payload = {
		author: document.getElementById('username').value,
		text: document.getElementById('texto').value,
		date: new Date()
	}

	socket.emit('new-message', payload)
	return false
}





