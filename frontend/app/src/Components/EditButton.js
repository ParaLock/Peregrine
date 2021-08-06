import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import React from 'react'

const StyledButton = withStyles({

    root: {
        //buttonRipple: "rgba(50, 167, 11, 0.1)",
        //borderColor: "rgb(50, 167, 11)",
        minWidth: "30px",
        "&:hover": {
            //backgroundColor: "rgba(50, 167, 11, 0.1)",
           // borderColor: "rgb(20, 167, 11)"
        }
    },
    label: {
        //color: "rgb(50, 167, 11)"
        padding: 0
    }
})(Button);


class EditButton extends React.Component {

    constructor(props) {
        super(props)
    }

    handleClick(evt) {

        evt.nativeEvent.stopImmediatePropagation();
        evt.stopPropagation(); 

        this.props.onClick();
    }

    render() {
       return <StyledButton  onMouseDown={this.handleClick.bind(this)} color={"primary"} >
                    <EditIcon  style={{padding: "0px"}} id="delete_button"/> 
                </StyledButton>
    }
}

export default EditButton;


