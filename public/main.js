'use strict';

var socket = io.connect('http://localhost:8080', { 'forceNew': true });
moment.locale('es');

socket.on('messages', function (data) {
	console.log(data);
	render(data);
});

socket.on('board-ready', function (data) {
	empty(document.getElementById('container'));
	swal('Tarjeta conectada!', 'ARDUINO ' + data.board + ' conectada al puerto ' + data.port, 'success');
	document.getElementById('container').innerHTML = '<div style="text-align: center;">\n\t\t<button class="button" id="iniciar">Iniciar</button>\n\t\t<button class="button" id="continuar">Continuar</button>\n\t</div>';

	document.getElementById('iniciar').addEventListener('click', function () {
		swal({
			title: 'Introduzca la contraseña',
			input: 'password',
			showCancelButton: true,
			confirmButtonText: 'Submit',
			showLoaderOnConfirm: true,
			preConfirm: function preConfirm(password) {
				return new Promise(function (resolve, reject) {
					socket.emit('check-password', password);
					socket.on('system-init', function (data) {
						if (data.pass) {
							resolve();
						} else {
							reject();
						}
					});
				});
			},
			allowOutsideClick: function allowOutsideClick() {
				return !swal.isLoading();
			}
		}).then(function (result) {
			if (!result.dismiss) {
				swal({
					position: 'top-end',
					type: 'success',
					title: 'Sistema iniciado exitosamente',
					showConfirmButton: false,
					timer: 1500
				});
				empty(document.getElementById('container'));
			}
		}).catch(function (result) {
			swal({
				type: 'error',
				title: 'Oops...',
				text: 'Contraseña invalida'
			});
		});
	});

	document.getElementById('continuar').addEventListener('click', function () {
		socket.emit('keep-going', null);
		socket.on('keep-going', function (data) {
			empty(document.getElementById('container')).innerHTML = '<h1 style="text-align: center;">' + data + '</h1>';
		});
	});
});

document.getElementById('resultados').addEventListener('click', function () {
	swal({
		title: 'Estas seguro ?',
		text: "Hacer esto terminará las elecciones y mostrara el resultado, no se podrá votar mas",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Sí, Mostrar resusltados !'
	}).then(function (result) {
		if (result.value) {
			swal({
				title: 'Introduzca la contraseña',
				input: 'password',
				showCancelButton: true,
				confirmButtonText: 'Submit',
				showLoaderOnConfirm: true,
				preConfirm: function preConfirm(password) {
					return new Promise(function (resolve, reject) {
						socket.emit('checkpassword', password);
						socket.on('checkpassword', function (data) {
							if (data) {
								resolve();
							} else {
								reject();
							}
						});
					});
				},
				allowOutsideClick: function allowOutsideClick() {
					return !swal.isLoading();
				}
			}).then(function (result) {
				if (result.value) {
					socket.emit('end', null);
				}
			}).catch(function () {
				swal({
					type: 'error',
					title: 'Oops...',
					text: 'Contraseña invalida'
				});
			});
		}
	});
});

socket.on('end', function (data) {
	empty(document.getElementById('container')).innerHTML = '<div id="chartContainer" style="height: 300px; width: 100%;">';
	empty(document.getElementById('footer'));
	var chart = new CanvasJS.Chart("chartContainer", {
		title: {
			text: "Elecciones Alcaravanes 2018"
		},
		data: [
		{
			type: "column",
			dataPoints: [{ label: 'Blanco', y: data.blanco.votos }, { label: 'Candidato 1', y: data.candidato1.votos }, { label: 'Candidato 2', y: data.candidato2.votos }, { label: 'Candidato 3', y: data.candidato3.votos }]
		}]
	});
	chart.render();
	socket.on('disconnect', function () {
		socket.disconnect();
	});
});

socket.on('locked', function (data) {
	data ? document.body.style.backgroundColor = 'red' : document.body.style.backgroundColor = 'initial';
});

socket.on('voted', function (data) {
	document.getElementById('container').innerHTML = '<h1 style="text-align: center;">' + data + '</h1>';
});

socket.on('down', function (data) {
	console.log(data);
});

function empty(element) {
	if (!(element instanceof HTMLElement)) {
		throw new TypeError('Expected an element');
	}

	var node;
	while (node = element.lastChild) {
		element.removeChild(node);
	}return element;
}

function startTime() {
	document.getElementById('header').innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
	var t = setTimeout(startTime, 500);
}