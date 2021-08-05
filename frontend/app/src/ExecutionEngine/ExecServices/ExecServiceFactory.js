
import BashExecService from './BashExecService';

export default class ExecServiceFactory {

    constructor(listeners) {

        this.services = {}

        this.services["BASH"] = new BashExecService(listeners);
    }

    getService(actionType) {

        if(!(actionType in this.services)) {

            return null;
        }

        return this.services[actionType];
    }

    getAllServices() {

        return Object.values(this.services);

    }

}