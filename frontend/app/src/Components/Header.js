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
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BarChartIcon from '@material-ui/icons/BarChart';
import InputIcon from '@material-ui/icons/Input';

export default class Header extends React.Component {

    static HEIGHT = 50

    constructor(props) {

        super(props);

        this.mutualyExclusives = [
          "task_panel",
          "parameter_panel",
          "conditional_panel"

        ]
    }

    toggle(name) {

		var thingsToToggle = []

		for(var i in this.mutualyExclusives) {

			if(this.mutualyExclusives[i] !== name) {

				thingsToToggle.push({state: false, name: this.mutualyExclusives[i]});
			}
		}

		thingsToToggle.push({state: null, name: name});

		this.props.toggleMany(thingsToToggle);

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
                        onClick={() => this.props.toggle("workflow_panel")}
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
                        onClick={() => this.toggle("conditional_panel")}
                        edge="start"
            
                        disabled={(this.props.selected["workflow"] == null) ? true : false}
                      >
                      <AccountTreeIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => this.toggle("parameter_panel")}
                        edge="start"
            
                        disabled={(this.props.selected["workflow"] == null) ? true : false}
                      >
                      <InputIcon />
                    </IconButton>
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => this.toggle("task_panel")}
                        edge="start"
                        disabled={(this.props.selected["workflow"] == null) ? true : false}
                      >
                      <AssignmentIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => this.props.toggle("log")}
                        edge="start"
          
                      >
                      <BarChartIcon />
                    </IconButton>

                  {this.props.children}
                </Toolbar>
              </AppBar>
            </div>
    }

}
