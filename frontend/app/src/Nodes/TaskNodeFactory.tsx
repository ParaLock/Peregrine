import { TaskNodeWidget } from './TaskNodeWidget';
import { TaskNodeModel } from './TaskNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class TaskNodeFactory extends AbstractReactFactory<TaskNodeModel, DiagramEngine> {
	constructor() {
		super('Task');
	}

	generateReactWidget(event: any): JSX.Element {
		return <TaskNodeWidget engine={this.engine} size={50} node={event.model} />;
	}

	generateModel(event: any) {
		return new TaskNodeModel();
	}
}