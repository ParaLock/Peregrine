import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


export default class Header extends React.Component {

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
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.props.onToggleSidebar.bind(this)}
                    edge="start"
        
                  >
                    <MenuIcon />
                  </IconButton>
                    {this.props.children}
                </Toolbar>
              </AppBar>
            </div>
    }

}
