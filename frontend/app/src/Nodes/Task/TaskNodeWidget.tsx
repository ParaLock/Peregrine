import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';
import { TaskNodeModel } from './TaskNodeModel';
import {DefaultPortLabel} from '@projectstorm/react-diagrams-defaults';
import styled from '@emotion/styled';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CircularProgress from '@material-ui/core/CircularProgress';

namespace S {
	export const Node = styled.div<{ background: string; selected: boolean }>`
		background-color: ${(p) => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
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

	export const InPortsContainer = styled.div`
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

    export const OutPortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
        align-items: flex-end;
		&:first-of-type {
			margin-left: 10px;
		}
		&:only-child {
			margin-left: 0px;
		}
	`;
}

const ButtonContainer = styled.div `
    display: flex;
    align-items: center;
    justify-content: center;

`;

export interface DefaultNodeProps {
	node: TaskNodeModel;
	engine: DiagramEngine;
}


export class TaskNodeWidget extends React.Component<DefaultNodeProps> {
	generatePort = (port: any) => {
		return <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />;
	};

	render() {

		var state = this.props.node.getState();
		var color = "rgb(0,192,255)";

		if(state == "SUCCESS") {
			color = 'rgb(100, 167, 11)';
		}

		if(state == "FAILED") {
			color = 'rgb(100, 0, 0)';
		}

		console.log(this.props.node.getState());

		return (
			
			<S.Node
				data-task-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={color}>
				<S.Title>
					<S.TitleName>{this.props.node.getOptions().name}</S.TitleName>
				</S.Title>
                
                <ButtonContainer>

                <S.InPortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</S.InPortsContainer>

					{ state !== "RUNNING" && 
						<IconButton
                            size={"small"}
                            color="inherit"
                            aria-label="open drawer"
                            edge={false}
							disabled={(state !== "DORMENT")}
                            onClick={() => this.props.node.getOptions().onExecute()}
                        >
							<PlayArrowIcon />
							
                    	</IconButton>
					}

					{state == "RUNNING" &&

						<CircularProgress  classes={{colorPrimary: "white"}} size={18} />

					}
		
                    <IconButton
                            size={"small"}
                            color="inherit"
                            aria-label="open drawer"
                            edge={false}
							disabled={(state == "RUNNING")}
                            onClick={() => this.props.node.getOptions().onReset()}
                        >
                        <RotateLeftIcon />
                    </IconButton>
					<S.OutPortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</S.OutPortsContainer>
                </ButtonContainer>

			</S.Node>
		);
	}
}