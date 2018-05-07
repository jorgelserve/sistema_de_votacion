const ls = require('local-storage')
const empty = require('empty-element')
const template = require('../template')
const yo = require('yo-yo')

module.exports = async function resultados() {
	let pass = prompt('Ingrese la contraseña')
	if (pass ==  ls.get('pass')) {
		empty(document.getElementById('container')).innerHTML = '<div id="chartContainer" style="height: 300px; width: 100%;">';



		var chart = new CanvasJS.Chart("chartContainer", {
		title: {
			text: "Elecciones Alcaravanes 2018"
		},
		data: [
		{
			type: "column",
			dataPoints: [
				{
					label: 'Blanco',
					y: ls.get('blanco')
				},
				{
					label: 'Candidato 1',
					y: ls.get('candidato')
				}
			]
		}]
	});
	chart.render();
	}
}
