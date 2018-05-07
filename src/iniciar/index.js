const ls = require('local-storage')
const empty = require('empty-element')
const template = require('../template')
const yo = require('yo-yo')

module.exports = async function iniciar() {
	let pass = prompt('Ingrese alguna contraseña')
	if (pass.length > 6) {
		ls.remove('pass')
		ls.remove('candidato')
		ls.remove('blanco')
		ls('pass')
		ls('candidato', 0)
		ls('blanco', 0)
		ls.set('pass', pass)
		empty(document.getElementById('container')).appendChild(template)
		document.getElementById('candidato').addEventListener('click', () => {
			swal({
				title: '¿ Esta seguro que desea votar por este candidato ?',
				text: "Tu voto no podrá ser modificado después ",
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
				text: "Tu voto no podrá ser modificado después ",
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
		alert('ingrese una contraseña mas fuerte')
	}

}
