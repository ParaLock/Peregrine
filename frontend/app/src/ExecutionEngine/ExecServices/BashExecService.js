
function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
}

export default class BashExecService {

    constructor() {

        this.cmdQueue = []; 
        this.inprogress = {}
        this.listeners = {}
        this.ws = new WebSocket('ws://localhost:9898/');

        this.ws.onopen = () => {
            
            this.wsReady = true;

            while(this.cmdQueue.length > 0 ) {

                var item = this.cmdQueue.pop();
                this.ws.send(JSON.stringify(item));
            }

        };

        this.ws.onmessage = (e) => {

			var obj = JSON.parse(e.data);

            var temp = Object.values(this.listeners);

            for(var i in temp) {

                temp[i](obj);
            }

            this.inprogress[obj.INSTANCE_ID].callback(obj);
        };

    }

    registerListener(callback, id) {

        this.listeners[id] = callback;
    }

    execute(cmd, actionName, callback) {
        
        var id = uuidv4();

        this.inprogress[id] = {}
        this.inprogress[id].instance_id = id; 
        this.inprogress[id].callback = callback;

        var request = {
            ACTION_TYPE: "BASH",
            INSTANCE_ID: id,
            ACTION_NAME: actionName,
            DETAILS: {
                CMD: cmd
            }
        }

        if(!this.wsReady) {

            this.cmdQueue.push(request);

        } else {

            this.ws.send(JSON.stringify(request));
        }

        return id;
    }   
}

