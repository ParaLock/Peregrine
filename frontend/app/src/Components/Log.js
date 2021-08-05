import React from 'react';
import LogViewer from './LogViewer';


class Log extends React.Component {

    static HEIGHT = 225

    constructor(props) {
        super(props);

        this.state = {
            entries: []
        }


    }
    componentDidMount() {

        this.updateFlag = !this.updateFlag;

        var services = this.props.execServiceFactory.getAllServices();

        for(var i in services) {

            services[i].registerListener((item)=> {

                var oldEntries = [...this.state.entries];

                if(item.MSG.TYPE == "LOG") {

                    oldEntries.push({ str: '[' + Date.now() + '] [' + item.ACTION_NAME + '] ' + " [status] " + " Begin", channel: "status"});

                    for(var j in item.MSG.DETAIL.LINES) {

                        if(item.MSG.DETAIL.LINES[j] != "") {
                           
                            oldEntries.push({ str: '[' + Date.now() + '] [' + item.ACTION_NAME + '] [' + item.MSG.DETAIL.CHANNEL + '] ' + item.MSG.DETAIL.LINES[j], channel: item.MSG.DETAIL.CHANNEL});

                        }

                    }

                }
                
                if(item.MSG.TYPE == "COMPLETION_STATUS") {

                    oldEntries.push({str: '[' + Date.now() + '] [' + item.ACTION_NAME + '] [status] Action completed with status: ' + item.MSG.DETAIL.STATUS + " -- REASON: " + item.MSG.DETAIL.MSG, channel: "status"});
                }   

                this.setState({entries: oldEntries})

                this.updateFlag = !this.updateFlag;

                this.forceUpdate();

            }, "log_listener");
        }

    }

    render() {

        return <LogViewer 
                            entries={this.state.entries} 
                            updateFlag={this.updateFlag}
                />
    }

}

export default Log;