const ls = require('local-storage')
const empty = require('empty-element')
const template = require('../template')
const yo = require('yo-yo')

module.exports = async function continuar() {
	let pass = prompt('Ingrese la contraseña')
	if (pass == ls.get('pass')) {
		empty(document.getElementById('container')).appendChild(template)
		document.getElementById('candidato').addEventListener('click', () => {
			swal({
				title: '¿ Esta seguro que desea votar por este candidato ?',
				text: "Tu voto podrá ser modificado después ",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí, estoy seguro !'
			})
			.then((result) => {
				ls('candidato', ls.get('candidato')+1)
				if (result.value) {
					swal(
						'Gracias por votar!',
						'',
						'success'
					)
				}
			})
		} )
		document.getElementById('blanco').addEventListener('click', () => {
			swal({
				title: '¿ Esta seguro que desea votar por este candidato ?',
				text: "Tu voto podrá ser modificado después ",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Sí, estoy seguro !'
			})
			.then((result) => {
				if (result.value) {
					ls('blanco', ls.get('blanco')+1)
					swal(
						'Gracias por votar!',
						'',
						'success'
					)
				}
			})
		} )
	} else {
		alert('Contraseña incorrecta')
	}

}
