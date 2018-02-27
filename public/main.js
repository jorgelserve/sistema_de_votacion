'use strict';

var socket = io.connect('https://hola-mun.herokuapp.com', { 'forceNew': true });
moment.locale('es');

socket.on('messages', function (data) {
	console.log(data);
	render(data);
});

function render(data) {
	var html = data.map(function (element, index) {
		return '<div>\n\t\t\t<strong>' + element.author + '</strong>: \n\t\t\t<em>' + element.text + '</em>\n\t\t\t<small>' + moment(element.date).fromNow() + '</small>\n\t\t</div>';
	}).join(" ");
	document.getElementById('messages').innerHTML = html;
}

function addMessage(e) {
	var payload = {
		author: document.getElementById('username').value,
		text: document.getElementById('texto').value,
		date: new Date()
	};

	socket.emit('new-message', payload);
	return false;
}