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

		return (
			<S.Node
				data-task-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={  this.props.node.getOptions().color!}>
				<S.Title>
					<S.TitleName>{this.props.node.getOptions().name}</S.TitleName>
				</S.Title>
                
                <ButtonContainer>

                <S.InPortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</S.InPortsContainer>
                    <IconButton
                            size={"small"}
                            color="inherit"
                            aria-label="open drawer"
                            edge={false}
                            onClick={() => this.props.node.getOptions().onExecute()}
                        >
                        <PlayArrowIcon />
                    </IconButton>
                    <IconButton
                            size={"small"}
                            color="inherit"
                            aria-label="open drawer"
                            edge={false}
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