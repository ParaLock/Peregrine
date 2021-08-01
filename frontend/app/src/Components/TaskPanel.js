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


const ListWrapper = styled.div`
    height: 100%;
    border: 1px solid #ccc;
	width: 400px;
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

    }

    shouldComponentUpdate() {
        return true;
    }

    render() {

        console.log(this.props.selectedWorkflow)
        return (

            <Wrapper>
                <ListWrapper>

                    <Paper  elevation={3} >
                            <List 
                                component="nav"
                                subheader={
                                    <ListSubheader component="div" id="nested-list-subheader">
                                        <b>Tasks</b>
                                    </ListSubheader>
                                }
                            >
                                <Divider/>

                                { this.props.selectedWorkflow && this.props.selectedWorkflow.TASKS.map((task, index)=> {

                                        return <StyledListItem
                                            button
                                            selected={(this.props.selectedTask) ? this.props.selectedTask.NAME === task.NAME : false}
                                            onClick={(event) => this.props.taskSelected(event, task)}
                                        >
                                            <ListItemText primary={(index + 1) + ")" + task.NAME} secondary={task.DESCRIPTION} />
                                        </StyledListItem>

                                    })
                                }

                            </List>
                        </Paper>
                        <Button 
                                fullWidth={true}  
                                variant="outlined" 
                                color="primary"
                                onClick={this.props.onAddTask.bind(this)}
                        >
                        Add Task
                        </Button>
                </ListWrapper>

            </Wrapper>
          )
    }
}

export default TaskPanel;
