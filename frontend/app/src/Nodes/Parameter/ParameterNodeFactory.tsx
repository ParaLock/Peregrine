import { ParameterNodeWidget } from './ParameterNodeWidget';
import { ParameterNodeModel } from './ParameterNodeModel';
import * as React from 'react';
import { AbstractReactFactory } from '@projectstorm/react-canvas-core';
import { DiagramEngine } from '@projectstorm/react-diagrams-core';

export class ParameterNodeFactory extends AbstractReactFactory<ParameterNodeModel, DiagramEngine> {
	constructor() {
		super('Parameter');
	}

	generateReactWidget(event: any): JSX.Element {
		return <ParameterNodeWidget engine={this.engine} node={event.model} />;
	}

	generateModel(event: any) {
		return new ParameterNodeModel();
	}
}