import React from 'react';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import ListSubheader from '@material-ui/core/ListSubheader';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import ForumIcon from '@material-ui/icons/Forum';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

const StyledListItem = withStyles({

    root: {
        '&$selected': {
          backgroundColor: 'lightgray'
        }
      },
      selected: {
       
      }
})(ListItem);

const openStyle = {

    transform: 'translateX(0%)',
    opacity: 1,
    maxWidth: '100%',
    transition: 'opacity 250ms, transform 250ms ease-in-out, max-width 250ms'
};

const closeStyle = {
    opacity: 0,
    maxWidth: 0,
    transform: 'translateX(-100%)',
    transition: 'opacity 250ms, transform 250ms ease-in-out, max-width 250ms'
};


const ListWrapper = styled.div`
    height: 100%;
    border: 1px solid #ccc;
    width: ${props => props.open ? "30%" : "100%"};
    margin-right: 3px;
    background-color: white;
`;

const Wrapper = styled.div`


	z-index: 1000;
    pointer-events:all;

`;

class WorkflowPanel extends React.Component {

    constructor() {
        super();

    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <Wrapper 
                style={(this.props.open) ? openStyle : closeStyle} id="sidebar_wrapper"
            >
                <ListWrapper>

                    <Paper  elevation={3} >
                            <List 
                                component="nav"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        <b>Workflows</b>
                                    </ListSubheader>
                                }
                            >
                                <Divider/>

                                {
                                    this.props.workflows.map((workflow)=> {

                                        console.log()

                                        return <StyledListItem
                                            button
                                            selected={this.props.selectedWorkflow.NAME === workflow.NAME}
                                            onClick={(event) => this.props.workflowSelected(event, workflow)}
                                        >
                                            <ListItemText primary={workflow.NAME} secondary={workflow.DESCRIPTION} />
                                        </StyledListItem>

                                    })
                                }

                            </List>
                        </Paper>
                        <Button 
                                fullWidth={true}  
                                variant="outlined" 
                                color="primary"
                                onClick={this.props.onAddWorkflow.bind(this)}
                        >
                        Add Workflow
                        </Button>
                </ListWrapper>
            </Wrapper>
          )
    }
}

export default WorkflowPanel;
