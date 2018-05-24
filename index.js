const axios = require('axios');
const secrets = require('./secrets.json');

function requestImages(cbSuccess = success, cbError = error) {
	return axios.get(`https://api.imageresizer.io/v1/search?key=${secrets.API_KEY}`, {
		sort: 'created',
	})
		.then(res => cbSuccess(res.data))
		.catch(err => cbError(err));
}

function requestRemoveImages(idArr, cbSuccess = success, cbError = error) {
	if (idArr.length < 5) {
		return stopExec();
	}
         return deleteImage(idArr.join(','), cbSuccess, cbError);
}

function deleteImage(image, cbSuccess, cbError) {
        // console.log(`https://api.imageresizer.io/v1/images/${image}/delete?key=${secrets.API_KEY}`)
	return axios.get(`https://api.imageresizer.io/v1/images/${image}/delete?key=${secrets.API_KEY}`)
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
	const requestCallback = (data) => requestRemoveImages(data.response.images.map(v => v.id), recurseRemove);
	// const test = (data) => console.log(data.response.images);
	requestImages(requestCallback);
}

function stopExec() {
	process.exit();
	return;
}
recurseRemove();
