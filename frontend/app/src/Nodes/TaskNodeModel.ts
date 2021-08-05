
import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams';
import { TaskPortModel } from './TaskPortModel';

export interface TaskNodeModelGenerics {
	PORT: TaskPortModel;
}

export class TaskNodeModel extends NodeModel<NodeModelGenerics & TaskNodeModelGenerics> {
	constructor() {
		super({
			type: 'Task'
		});
		this.addPort(new TaskPortModel(PortModelAlignment.TOP));
		this.addPort(new TaskPortModel(PortModelAlignment.LEFT));
		this.addPort(new TaskPortModel(PortModelAlignment.BOTTOM));
		this.addPort(new TaskPortModel(PortModelAlignment.RIGHT));
	}
}