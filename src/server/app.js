import app from './http';
import handler from './ws';
import http from 'http';
import ws from 'ws';
import persistence from './services/persist';

function startService(name, callback, ...args) {
	const msg = 'starting ' + name + ' service...';
	let result : String;
	let ex = null;
	process.stdout.write(msg);
	try {
		callback(...args);
		result = '[OK]';
	} catch(exception) {
		ex = exception;
		result = '[FAIL]\n' + ex.toString();
	} finally {
		console.log('%s%s', ' '.repeat(80 - msg.length - result.length), result);
		return ex === null;
	}
}

// Initialize http server, and socket server
function initWebServices() {
	startService('web server & socket server', () => {
		const server = http.createServer(app.callback());
		const wss = new ws.Server({server});
		wss.on('connection', handler);
		server.listen(3000);
	});
}

const limit = 10;
persistence.initialize('mongodb://localhost/test').then(
	function() {
		console.log('mongoose connection established');
        initWebServices();
        const currentBoot = new persistence.BootModel();
        currentBoot.save((err, boot) => {
            if(err) {
                console.log('Failed to log server startup date.');
            }
            persistence.BootModel
                .find()
                .limit(limit + 1)
                .sort({ date: -1 })
                .exec((err, boots) => {
                    if(err) {
                        console.log('Failed to load previous boots.');
                    }
                    let counter = 0;
                    for(let boot of boots) {
                        let current = boot.date == currentBoot.date;
                        if(++counter > limit)
                            console.log('...');
                        else
                            console.log('   ' + (current ? '*' : ' ') + boot.date);
                    }
                });
        });
	},
	console.error.bind(console, 'mongoose connection error:')
);