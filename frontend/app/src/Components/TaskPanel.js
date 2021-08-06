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
import { getWorkflow, getTask, getAction } from '../Common';
import StyledButton from './StyledButton';
import DeleteButton from './DeleteButton';
import EditButton from './EditButton';

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

class TaskPanel extends React.Component {

    constructor() {
        super();

        this.state = {

        }

    }

    shouldComponentUpdate() {
        return true;
    }

    taskSelected(event, name) {
        this.setState({ ['show' + name]: !this.state['show' + name] }, () => {
            this.props.taskSelected(event, name)
        });
    }

    render() {

        var selectedWorkflow = getWorkflow(this.props.selected["workflow"], this.props.model);
        var selectedTask = getTask(this.props.selected["task"], selectedWorkflow);
        var selectedAction = getAction(this.props.selected["action"], selectedTask);

        return (

            <Wrapper>
                <ListWrapper>

                    <Paper elevation={3} >
                        <List
                            component="nav"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <b>Tasks</b>
                                </ListSubheader>
                            }
                        >
                            <Divider />

                            {selectedWorkflow && selectedWorkflow.TASKS.map((task, index) => {

                                return <span style={{ marginLeft: '0px', paddingLeft: '0px' }}>
                                    <StyledListItem
                                        button
                                        selected={(selectedTask) ? selectedTask.ID === task.ID : false}
                                        onClick={(event) => { this.taskSelected(selectedWorkflow.ID, task.ID) }}
                                    >

                                        <ListItemText primary={task.NAME} secondary={task.DESCRIPTION} />
             
                                        {this.state["show" + task.ID] ? <ExpandLess /> : <ExpandMore />}
     
                                    </StyledListItem>
                                    <Collapse in={this.state["show" + task.ID]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>

                                            {
                                                task.ACTIONS.map((action) => {

                                                    return <ListItem
                                                        button
                                                        style={{ marginLeft: '20px' }}
                                                        selected={(selectedAction) ? selectedAction.ID === action.ID : false}
                                                        onClick={(event) => this.props.actionSelected(selectedWorkflow.ID, task.ID, action.ID)}
                                                    >
                                                        <ListItemText primary={action.NAME} />
                                            
                                                        <EditButton onClick={() =>{}}/>
                                                        <DeleteButton onClick={() =>{}}/>
                                                    </ListItem>
                                                })
                                            }


                                            <StyledButton
                                                fullWidth={false}
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => { this.props.onAddAction(task.ID) }}
                                            >
                                                Add Action
                                                </StyledButton>

                                        </List>
                                    </Collapse>
                                </span>

                            })
                            }

                        </List>
                    </Paper>
                    <StyledButton
                        fullWidth={true}
                        variant="outlined"
                        color="primary"
                        onClick={this.props.onAddTask.bind(this)}
                    >
                        Add Task
                        </StyledButton>
                </ListWrapper>

            </Wrapper>
        )
    }
}

export default TaskPanel;
