const axios = require('axios');
const secrets = require('./secrets.json');

const dt = new Date();

const currentMonth =  dt.getMonth();

function requestImages(cbSuccess = success, cbError = error) {
	return axios.get(`https://api.imageresizer.io/v1/search?key=${secrets.API_KEY}`, {
		sort: 'created',
	})
		.then(res => cbSuccess(res.data))
		.catch(err => cbError(err));
}

function requestRemoveImages(idArr, cbSuccess = success, cbError = error) {
	if (idArr.length > 20) {
		throw new Error('Too many images passed to requestRemoveImages');
	}
	console.log(`https://api.imageresizer.io/v1/images/${idArr.join(',')}/delete?key=${secrets.API_KEY}`)
	return axios.get(`https://api.imageresizer.io/v1/images/${idArr.join(',')}/delete?key=${secrets.API_KEY}`)
		.then(res => cbSuccess(res.data))
		.catch(err => cbError(err));
}

function success(res) {
	if (res.sucesss !== true) {
		throw new Error(`Error with response, received -- ${res.success}`)
	}
}

function error(err) {
	throw new Error(err);
}

function recurseRemove(stuff) {
	if (stuff) {
		console.log(stuff);
	}
	console.log('running');
	const requestCallback = (data) => requestRemoveImages(data.response.images.map(v => v.id), recurseRemove);
	const test = (data) => console.log(data.response.images);
	requestImages(requestCallback);
}
recurseRemove();
