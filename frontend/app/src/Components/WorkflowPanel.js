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
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import { getWorkflow, getTask, getAction } from '../Common';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

const StyledListItem = withStyles({

    root: {
        '&$selected': {
          backgroundColor: 'lightgray'
        }
      },
      selected: {
       
      }
})(ListItem);

const ListWrapper = styled.div`
    height: 100%;
    border: 1px solid #ccc;
    width: 250px;
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

        var selectedWorkflow = getWorkflow(this.props.selected["workflow"], this.props.model);

        return (

            <Wrapper >
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

                                { this.props.model.map((workflow)=> {

                                        return <StyledListItem
                                                    button
                                                    selected={(selectedWorkflow) ? selectedWorkflow.ID === workflow.ID : false}
                                                    onClick={(event) => this.props.workflowSelected(workflow.ID)}
                                                >
                                            <ListItemText primary={workflow.NAME} secondary={workflow.DESCRIPTION} />
                                            
                                            
                                            {((selectedWorkflow) ? selectedWorkflow.ID === workflow.ID : false) && 
                                                <IconButton
                                                    size={"large"}
                                                    color="inherit"
                                                    aria-label="open drawer"
                                                    edge={false}
                                                    onClick={() => {this.props.onWorkflowExecute(selectedWorkflow.ID)}}
                                                >
                                                    <PlayArrowIcon />
                                                    
                                                </IconButton>
                                            }
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
