import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { ParameterNodeModel } from './ParameterNodeModel';
import {DefaultPortLabel} from '@projectstorm/react-diagrams-defaults';
import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup } from '@material-ui/core';

namespace S {
	export const Node = styled.div<{ background: string; selected: boolean }>`
		background-color: ${(p) => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		height: 95px;
		width: 190px;
		font-size: 11px;
		border: solid 2px ${(p) => (p.selected ? 'rgb(0,192,255)' : 'black')};
	`;

	export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
	`;

	export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`;

	export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

	export const PortContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		&:first-of-type {
			margin-right: 10px;
		}
		&:only-child {
			margin-right: 0px;
		}
	`;
}

const ButtonContainer = styled.div `
    display: flex;
    align-items: center;
    justify-content: center;
	flex-direction: column;

`;

export interface DefaultNodeProps {
	node: ParameterNodeModel;
	engine: DiagramEngine;
}


export class ParameterNodeWidget extends React.Component<DefaultNodeProps> {
	
	generatePort = (port: any) => {
		return <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />;
	};

	render() {

		return (
			<S.Node
				data-Parameter-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={  this.props.node.getOptions().color!}>
				<S.Title>
					<S.TitleName>{this.props.node.getOptions().name}</S.TitleName>
				</S.Title>
                
                <ButtonContainer>

				<TextField
						fullWidth={false}
						label="Value"
						variant="filled"
						size="small"
						//onChange={(evt) => this.handleChange(evt.target.value, "name")}
						//value={this.state.data["name"] ?? ""}
						//error={this.state.errors["name"].length > 0}
                />
		
                <S.PortContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</S.PortContainer>
                </ButtonContainer>

			</S.Node>
		);
	}
}