
import React from 'react';
import styled from 'styled-components';
import './App.css';

import WorkflowPanel from './Components/WorkflowPanel'
import Header from './Components/Header'
import WorkflowForm from './Components/WorkflowForm'
import TaskPanel from './Components/TaskPanel'

import InitialWorkflows from './workflow_list.json'

import createEngine, { 
	DefaultLinkModel, 
	DefaultNodeModel,
	DiagramModel 
} from '@projectstorm/react-diagrams';

import {CanvasWidget } from '@projectstorm/react-canvas-core';


const Wrapper = styled.div`
		width: 100%;
		height: 100%;
		background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent);
		background-color: rgb(60, 60, 60);
		background-size: 50px 50px;
`;

const Columns = styled.div `

	width: 100%;
	height: calc(100% - 50px);
	display: flex;

	overflow:hidden;
	flex-direction: column;
`;

const WorkflowPanelWrapper = styled.div`
    display: flex;
	position: absolute;
    border-radius: 16px;
    width: 400px;
		
	transform: ${props => props.open ? "translateX(0%)" : "translateX(-100%)"};
	transition: opacity 250ms, transform 250ms ease-in-out, max-width 250ms;

	opacity: ${props => props.open ? "1" : "0"};

	z-index: 1000;
    height: calc(100% - 50px);

	pointer-events:none;
`;

const TaskPanelWrapper = styled.div`
	
	display: flex;
	
	position: absolute;
	overflow:hidden;

	right: 0;

	max-width: ${props => props.open ? "100%" : "0%"};
	transform: ${props => props.open ? "translateX(0%)" : "translateX(100%)"};
	transition: opacity 250ms, transform 250ms ease-in-out, max-width 250ms;
	opacity: ${props => props.open ? "1" : "0"};

	z-index: 1000;

	height: calc(100% - 50px);

	pointer-events:none;
`;



class App extends React.Component {

		constructor(props) {
				super(props)

				this.engine = createEngine();
				// const node1 = new DefaultNodeModel({
				// 	name: 'Node 1',
				// 	color: 'rgb(0,192,255)',
				// });
				// node1.setPosition(100, 100);
				// let port1 = node1.addOutPort('Out');

				// const node2 = new DefaultNodeModel({
				// 	name: 'Node 1',
				// 	color: 'rgb(0,192,255)',
				// });
				// node2.setPosition(100, 100);
				// let port2 = node2.addOutPort('Out');

				//const link = port1.link<DefaultLinkModel>(port2);


				this.model = new DiagramModel();
				// model.addAll(node1, node2, link);
				this.engine.setModel(this.model);

				this.state = {
					workflowPanelOpen: false,
					taskPanelOpen: false,
					selectedTask: null,
					selectedWorkflow: null,
					workflows: InitialWorkflows.workflows,
					workflowFormOpen: false
				}

		}

		generateNode(taskName, task, tasks, visitedList, previous, model) {


			if(!(taskName in visitedList)) {

				const node = new DefaultNodeModel({
					name: taskName,
					color: 'rgb(0,192,255)',
				});
	
				node.setPosition(100, 100);

				visitedList[taskName] = true;

				model.addNode(node)

				var input = node.addInPort('IN');
				var output = node.addOutPort('OUT');

				task.output = output;
				task.input = input;

			}

			//if we have a previousOutput we are a child of a parent node.
			if(previous) {

				const link = task.output.link(previous.input);

				model.addLink(link)
			}

			for(var i in task.PARENTS) {

				var parentName = task.PARENTS[i];

				this.generateNode(parentName, tasks[parentName], tasks, visitedList, task, model)
			}
		}

		createModel(workflow) {

			var hashedTasks = {}

			for(var i in workflow.TASKS) {

				hashedTasks[workflow.TASKS[i].NAME] = workflow.TASKS[i]
			}

			var visited = {}

			workflow.DIAGRAM = new DiagramModel();
			
			var taskNames = Object.keys(hashedTasks)
			

			for(var tasksIdx in taskNames) {

				this.generateNode(taskNames[tasksIdx], hashedTasks[taskNames[tasksIdx]], hashedTasks, visited, null, workflow.DIAGRAM);
			}

		}

		addWorkflow(data) {

			var newWorkflow = {
				NAME: data.name,
				DESCRIPTION: data.description,
				TASKS: [],
				DIAGRAM: new DiagramModel()
			}

			this.setState({workflows: [...this.state.workflows, newWorkflow]}, 
			() => {

				this.workflowSelected({}, newWorkflow)

			});

			this.toggleWorkflowForm(false)

		}

		toggleWorkflowPanel() {

			this.setState({workflowPanelOpen: !this.state.workflowPanelOpen});
		}

		toggleWorkflowForm(state) {

			this.setState({workflowFormOpen: state});
		}

		toggleTaskPanel() {
			this.setState({taskPanelOpen: !this.state.taskPanelOpen});
		}

		workflowSelected(event, workflow) {

			this.setState({selectedWorkflow: workflow}, () => {
				

				if(!workflow.DIAGRAM) {

					this.createModel(workflow);
				}


				this.engine.setModel(workflow.DIAGRAM)
				this.forceUpdate()

			});


		}

		taskSelected(event, task) {
			this.setState({selectedTask: task});
		}

		render() {


			return <Wrapper>

				<WorkflowForm 
                        workflows={this.state.workflows}
                        open={this.state.workflowFormOpen} 
                        onConnect={(data)=> { this.toggleWorkflowForm(false); this.addWorkflow(data)}}
                        onClose={() => this.toggleWorkflowForm(false)}
						onAdd={(data) => this.addWorkflow(data)}
        />

				<Header	
				
					onToggleWorkflowPanel={this.toggleWorkflowPanel.bind(this)} 
					onToggleTaskPanel={this.toggleTaskPanel.bind(this)}


				></Header>

				<Columns>

					<WorkflowPanelWrapper open={this.state.workflowPanelOpen}>
							<WorkflowPanel 
											open={this.state.workflowPanelOpen}  
											workflowSelected={this.workflowSelected.bind(this)} 
											selectedWorkflow={this.state.selectedWorkflow} 
											workflows={this.state.workflows}
											onAddWorkflow={() => this.toggleWorkflowForm(true)}
							/> 
					</WorkflowPanelWrapper>

					<TaskPanelWrapper open={this.state.taskPanelOpen}>

							<TaskPanel 
											open={this.state.taskPanelOpen}  
											taskSelected={this.taskSelected.bind(this)} 
											selectedWorkflow={this.state.selectedWorkflow} 
											selectedTask={this.state.selectedTask}
											onAddTask={() => this.toggleTaskForm(true)}
							/> 

					</TaskPanelWrapper>

					<CanvasWidget className="graphContainer" engine={this.engine} />

				</Columns>

			</Wrapper>
		}
}

export default App;
