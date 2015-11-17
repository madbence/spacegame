// Manage persistent storage
// built upon mongoose (which is built on top of mongodb)

import mongoose from 'mongoose';

const BootSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now, get: d => d.toUTCString()}
});
export const BootModel = mongoose.model('Boot', BootSchema);

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
			resolve();
		});
	});
}

export default {
    BootModel, initialize
};
