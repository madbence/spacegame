// Manage persistent storege
// built uppon mongoose (which is built on top of mongodb)

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const schemas = {};
export const models = {};
function initModels() {
	for (let name in schemas) {
		if(schemas.hasOwnProperty(name)) {
			models[name] = mongoose.model(name, schemas[name]);
		}
	}
}
function initSchemas() {
	schemas.Boot = new Schema({
		date: {type: Date, default: Date.now, get: d => d.toUTCString()}
	});

	initModels();
}

let _initialized : boolean = false;
export function initialize(connstr) : Promise {
	if(_initialized) {
		const message = 'Can not initialize persistence service more than once'; 
		throw {message, toString: () => message};
	}
	_initialized = true;
	return new Promise((resolve, reject) => {
		mongoose.connect(connstr);
		const db = mongoose.connection;
		db.on("error", reject);
		db.once('open', function() {
			initSchemas();
			resolve();
		});
	});
}
