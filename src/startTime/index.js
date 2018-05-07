


(function startTime() {
	document.getElementById('header').innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a')
	const t = setTimeout(startTime, 500)
})()
