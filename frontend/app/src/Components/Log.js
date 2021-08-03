import React from 'react';
import LogViewer from './LogViewer';


class Log extends React.Component {

    static HEIGHT = 225

    constructor(props) {
        super(props);

    }
    componentDidMount() {

        this.updateFlag = !this.updateFlag;
    }

    render() {

        return <LogViewer 
                            entries={this.props.entries} 
                            updateFlag={this.updateFlag}
                />
    }

}

export default Log;