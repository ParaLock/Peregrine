import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Box from '@material-ui/core/Box';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import PublishIcon from '@material-ui/icons/Publish';
import MessageIcon from '@material-ui/icons/Message';
import BarChartIcon from '@material-ui/icons/BarChart';

export default class Header extends React.Component {

    static HEIGHT = 50

    constructor(props) {

        super(props);
    }

    render() {

        return <div>
            <CssBaseline />
              <AppBar
                id="main_app_bar"
                position="relative"
              >
                <Toolbar variant="dense">

                    <Box display='flex' flexGrow={1}>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.props.onToggleWorkflowPanel.bind(this)}
                        edge="start"
            
                      >
                        <MenuIcon />
                      </IconButton>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={this.props.onDownload.bind(this)}
                      >
                      <SaveAltIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={()=>{this.upload.click()}}
                      >
                      <PublishIcon />
                    </IconButton>
                    <input id="myInput"
                      type="file"
                      ref={(ref) => this.upload = ref}
                      style={{display: 'none'}}
                      onChange={this.props.onUpload.bind(this)}
                    />
                    </Box>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.props.onToggleLog.bind(this)}
                        edge="start"
            
                      >
                      <BarChartIcon />
                    </IconButton>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={this.props.onToggleTaskPanel.bind(this)}
                        edge="start"
            
                      >
                      <AssignmentIcon />
                    </IconButton>

                  {this.props.children}
                </Toolbar>
              </AppBar>
            </div>
    }

}
