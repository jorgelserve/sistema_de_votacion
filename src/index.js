const ls = require('local-storage')
const iniciar = require('./iniciar')
const continuar = require('./continuar')
const resultados = require('./resultados')

require('babel-polyfill')
require('./startTime')
moment.locale('es');


const iniciar_btn = document.getElementById('iniciar')
const continuar_btn = document.getElementById('continuar')
const resultados_btn = document.getElementById('resultados')

iniciar_btn.addEventListener('click', iniciar)
continuar_btn.addEventListener('click', continuar)
resultados_btn.addEventListener('click', resultados)
