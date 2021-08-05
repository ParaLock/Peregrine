const http = require('http');
const WebSocketServer = require('websocket').server;


const server = http.createServer();

server.listen(9898);

const wsServer = new WebSocketServer({
    httpServer: server
});

function populateHeader(source, dest, extra = {}) {

	dest.ACTION_TYPE = source.ACTION_TYPE;
	dest.ACTION_NAME = source.ACTION_NAME;
	dest.INSTANCE_ID = source.INSTANCE_ID;

	var keys = Object.keys(extra);

	for(var i in keys) {

		dest[keys[i]] = extra[keys[i]];
	}
}

function handleBashAction(request, connection) {

	if(request.ACTION_TYPE == "BASH") {

		const { spawn } = require('child_process');
		const child = spawn('ls', ['-lh', '/usr']);

		child.stdout.setEncoding('utf8');
		child.stdout.on('data', (chunk) => {

			var lines = chunk.split('\n');
			var response = {
				MSG: {
					TYPE: "LOG",
					DETAIL: {
						LINES: lines 
					}
				}
			}

			populateHeader(request, response)

			connection.send(JSON.stringify(response));

		});

		child.on('close', (code) => {

			var response = {
				MSG: {
					TYPE: "EXIT_STATUS",
					DETAIL: {
						CODE: code 
					}
				}
			}

			populateHeader(request, response)

			connection.send(JSON.stringify(response));

		});

	}

}

wsServer.on('request', function(request) {

	const connection = request.accept(null, request.origin);

  	connection.on('message', function(message) {

		var request = JSON.parse(message.utf8Data);

		handleBashAction(request, connection);

  });
  
  connection.on('close', function(reasonCode, description) {

      console.log('Client has disconnected.');
  });

});
