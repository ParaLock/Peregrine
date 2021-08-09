
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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@material-ui/core';
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
  width: 600px;
`;

class ActionForm extends React.Component {

    constructor() {

        super();

        this.state = {
            errors: {name: "", type: "", bash_cmd: ""},
            data: {name: "", type: "", bash_cmd: ""},
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

                    if(!(this.state.data["bash_cmd"] == "")) {

                        return true;
                    }

                    return false;
                }, 
                msg: "Non empty command required.", 
                target: "bash_cmd"
            },
            {
                callback: () => {

                    var isValid = true;

                    for(var i in this.props.actions) {

                        if(this.state.data["name"] == this.props.actions[i].NAME) {
                            isValid = false;
                        }
                    }

                    if(isValid) {

                        return true;
                    }

                    return false;

                }, 
                msg: "Action name already in use.", 
                target: "name"
            }
        ]
    }

    componentDidUpdate(prevProps, prevState) {

        if (!prevProps.open && this.props.open) {

            if(this.props.mode == "EDIT") {

                var action = getAction(this.props.selected["action"], getTask(this.props.selected["task"], getWorkflow(this.props.selected["workflow"], this.props.model)));

                console.log(action);

                var errors = {...this.state.errors};
                errors.name = "";
                errors.type = "";
                errors.bash_cmd = "";

                var data = {...this.state.data};
                data.name = action.NAME;
                data.type = action.TYPE;
                data.bash_cmd = action.DETAILS.CMD;

                this.setState({errors: errors, data: data}, () => {

                    this.validateInputs();
                });
                
            } else {

                this.validateInputs();
            }
        }

    }

    onAdd() {

        this.props.onAdd(this.state.data);
    }

    onEdit() {
        
        this.props.onEdit(this.state.data);
    }

    validateInputs() {
        
        var isValid = true;
        var errors = {name: "", type: "", bash_cmd: ""};
     
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

        return <Dialog onClose={() => this.props.onClose()} maxWidth={"xl"} aria-labelledby="customized-dialog-title" open={this.props.open}>
                    <StyledDialogTitle id="customized-dialog-title" onClose={() => this.props.onClose()}>
                        Action Form
                    </StyledDialogTitle>
                    <DialogContent dividers>
                        <form>


                        </form>
                        <Wrapper>

                            <FormControl>

                                <InputLabel >Type</InputLabel>
                                <Select

                                    style = {{width: 150, marginRight: 10}}
                                    variant={"outlined"}
                                    helperText={this.state.errors["type"]}
                                    onChange={(evt) => this.handleChange(evt.target.value, "type")}
                                    value={this.state.data["type"] ?? ""}
                                    error={this.state.errors["type"].length > 0}
                                >
                                <MenuItem value={"BASH"}>Bash</MenuItem>
                                <MenuItem value={"API"}>API</MenuItem>
                                <MenuItem value={"WebView"}>WebView</MenuItem>
                                </Select>
 
                            </FormControl>

                            <FormControl >
                                <TextField
                                    fullWidth={true}
                                    style = {{width: 350}}
                                    label="Name"
                                    variant="outlined"
                                    size="medium"
                                    helperText={this.state.errors["name"]}
                                    onChange={(evt) => this.handleChange(evt.target.value, "name")}
                                    value={this.state.data["name"] ?? ""}
                                    error={this.state.errors["name"].length > 0}
                                />

                            </FormControl>
           
                            <br/>
                            <br/>
                            <br/>

                            {   this.state.data["type"] == "BASH" && 
                                <FormControl >
                                    {/* <TextField
                                        fullWidth={true}
                                        style = {{width: 400}}
                                        label="Cmd"
                                        variant="outlined"
                                        size="medium"
                                        helperText={this.state.errors["bash_cmd"]}
                                        onChange={(evt) => this.handleChange(evt.target.value, "bash_cmd")}
                                        value={this.state.data["bash_cmd"] ?? ""}
                                        error={this.state.errors["bash_cmd"].length > 0}
                                    /> */}

                                    <TextField
                                        fullWidth={true}
                                        style = {{width: 510}}
                                        label="Cmd"
                                        variant="outlined"
                                        size="medium"
                                        multiline={true}
                                        minRows={5}
                                        helperText={this.state.errors["bash_cmd"]}
                                        onChange={(evt) => this.handleChange(evt.target.value, "bash_cmd")}
                                        value={this.state.data["bash_cmd"] ?? ""}
                                        error={this.state.errors["bash_cmd"].length > 0}
                                    />
                                </FormControl>

                            }

                            {   this.state.data["type"] == "API" &&

                                <FormControl><div>Work In Progress</div></FormControl>

                            }

                            {   this.state.data["type"] == "WebView" &&
                                
                                <FormControl><div>Work In Progress</div></FormControl>
                            }   

        

       
             
                        </Wrapper>
       

                    </DialogContent>
                    <DialogActions>         
                    
                    {this.props.mode == "CREATE" && 
                        <Button autoFocus disabled={!this.state.isInputValid} onClick={() => this.onAdd()} color="primary">
                            Add
                        </Button>
                    }

                    { this.props.mode == "EDIT" && 
                        <Button autoFocus disabled={!this.state.isInputValid} onClick={() => this.onEdit()} color="primary">
                            Edit
                        </Button>
                    }

           
                    </DialogActions>
                </Dialog>

    }

}

export default ActionForm;