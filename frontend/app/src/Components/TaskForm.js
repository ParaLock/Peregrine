
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { getWorkflow, getTask, getAction } from '../Common';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

const StyledDialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <DialogTitle disableTypography className={classes.root} {...other}>
        <Typography>{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  });

const Wrapper = styled.div`
  width: 400px;
`;

class TaskForm extends React.Component {

    constructor() {

        super();

        this.state = {
            errors: {name: ""},
            data: {name: ""},
            isInputValid: true
        }

        this.validators = [

            {
                callback: () => {

                    if(!(this.state.data["name"] == "")) {

                        return true;
                    }

                    return false;
                }, 
                msg: "Name required.", 
                target: "name"
            },
            {
                callback: () => {

                    var isValid = true;

                    var tasks = getWorkflow(this.props.selected["workflow"], this.props.model).TASKS ?? [];

                    for(var i in tasks) {

                        if(this.state.data["name"] == tasks[i].NAME) {
                            isValid = false;
                        }
                    }

                    if(isValid) {

                        return true;
                    }

                    return false;

                }, 
                msg: "Task name already in use.", 
                target: "name"
            }
        ]
    }

    componentDidUpdate(prevProps, prevState) {

        if (!prevProps.open && this.props.open) {
            this.validateInputs();
        }

    }

    onAdd() {

        this.props.onAdd(this.state.data);
    }

    validateInputs() {
        
        var isValid = true;
        var errors = {name: ""};
     
        for(var i in this.validators) {

            var validator = this.validators[i];

            if(!validator.callback()) {
                
                errors[validator.target] = validator.msg;
            }
        }

        for(var i in errors) {
            
            if(errors[i] != "") {

                isValid = false;

                break;
            }
        }

        this.setState({errors: errors, isInputValid: isValid});

        return isValid;
    }   

    handleChange(val, field) {

        if(!val) {
            val = "";
        }

        this.setState({
            data: {
            ...this.state.data,
            [field]: val
        }}, ()=> {

            this.validateInputs();
        });
    }

    render() {

        return <Dialog onClose={() => this.props.onClose()} aria-labelledby="customized-dialog-title" open={this.props.open}>
                    <StyledDialogTitle id="customized-dialog-title" onClose={() => this.props.onClose()}>
                        New Task Form
                    </StyledDialogTitle>
                    <DialogContent dividers>
                        <Wrapper>
                            <TextField
                                fullWidth={true}
                                label="Name"
                                variant="filled"
                                size="small"
                                helperText={this.state.errors["name"]}
                                onChange={(evt) => this.handleChange(evt.target.value, "name")}
                                value={this.state.data["name"] ?? ""}
                                error={this.state.errors["name"].length > 0}
                            />
             
                        </Wrapper>
       

                    </DialogContent>
                    <DialogActions>         
                    <Button autoFocus disabled={!this.state.isInputValid} onClick={() => this.onAdd()} color="primary">
                        Add
                    </Button>
           
                    </DialogActions>
                </Dialog>

    }

}

export default TaskForm;