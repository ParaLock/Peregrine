
import React from 'react';
import styled from 'styled-components';
import './App.css';

import WorkflowPanel from './Components/WorkflowPanel'
import Header from './Components/Header'
import WorkflowForm from './Components/WorkflowForm'
import TaskForm from './Components/TaskForm'
import TaskPanel from './Components/TaskPanel'
import ActionForm from './Components/ActionForm'

import _ from 'lodash'

import createEngine, { 
	DefaultLinkModel, 
	DefaultNodeModel,
	DiagramModel,
	NodeModel,
	DagreEngine,
	DiagramEngine,
	PathFindingLinkFactory
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

const ActionPanelWrapper = styled.div`
	
	display: flex;
	position: absolute;
	overflow:hidden;
	right: 0;
	max-width: ${props => props.open ? "100%" : "0%"};
	transform: ${props => props.open ? "translateX(-400px)" : "translateX(100%)"};
	transition: opacity 250ms, transform 250ms ease-in-out, max-width 250ms;
	opacity: ${props => props.open ? "1" : "0"};
	z-index: 1000;
	height: calc(100% - 50px);
	pointer-events:none;
`;

const saveFile = async (blob) => {
	const a = document.createElement('a');

	var d = new Date().toISOString().split('T')[0]

	a.download = "beaver-session-" + d  + '.json';
	a.href = URL.createObjectURL(blob);
	a.addEventListener('click', (e) => {
	  setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
	});
	a.click();
};

function removeIf(array, callback) {
    var i = 0;
    while (i < array.length) {
        if (callback(array[i], i)) {
            array.splice(i, 1);
        }
        else {
            ++i;
        }
    }
}

class App extends React.Component {

		constructor(props) {
				super(props)

				this.engine = createEngine();

				this.layoutEngine = new DagreEngine({
					graph: {
						rankdir: 'LR',
						ranker: 'longest-path',
						marginx: 25,
						marginy: 25
					},
					includeLinks: false
				});
				this.model = new DiagramModel();
				// model.addAll(node1, node2, link);
				this.engine.setModel(this.model);

				this.state = {
					workflowPanelOpen: false,
					taskPanelOpen: false,
					taskFormOpen: false,
					actionFormOpen: false,
					actionPanelOpen: false,
					selectedTask: null,
					selectedWorkflow: null,
					workflows: [],
					workflowFormOpen: false
				}

		}

		handleNodeSelect(evt) {
			
			if(evt.isSelected) {

				var task = this.state.selectedWorkflow.TASKS.filter((item) => item.NAME == evt.entity.options.name);

				this.setState({selectedTask: task[0]});
			} else {
				
				this.setState({selectedTask: null});
			}
		}

		removeTask(name) {

			var newState = [...this.state.workflows]
			var workflowName = this.state.selectedWorkflow.NAME;
			var workflow = newState.filter((item) => item.NAME == workflowName)[0]

			removeIf(workflow.TASKS, (item) => {

				return item.NAME == name;
			})

			this.setState({workflows: newState}, () => {

				this.setState({selectedWorkflow: workflow})
			})
			
		}

		handleNodeEvent(evt) {

			console.log("Node event: ")
			console.log(evt)

			if(evt.function == "selectionChanged") {
				this.handleNodeSelect(evt);
			}

			if(evt.function == "entityRemoved") {
				this.removeTask(evt.entity.options.name)
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

		addTask(data) {

			if(this.state.selectedWorkflow) {

				var newTask = {
					NAME: data.name,
					ACTIONS: [
						{
							NAME: "test1"
						},
						{
							NAME: "test2"
						}
					],
					PARENTS: []
				}

				const node = new DefaultNodeModel({
					name: data.name,
					color: 'rgb(0,192,255)',
				});
	
				console.log(node)

				node.registerListener({
					eventDidFire: (evt) => {
						this.handleNodeEvent(evt)
					}	
				});

				var input = node.addInPort('IN');
				var output = node.addOutPort('OUT');

				var oldWorkflow = {...this.state.selectedWorkflow};

				oldWorkflow.TASKS.push(newTask);

				this.state.selectedWorkflow.DIAGRAM.addNode(node)
	
			}

			this.toggleTaskForm(false)
		}

		toggleActionForm(state) {
			this.setState({actionFormOpen: state});
		}

		toggleWorkflowPanel() {

			this.setState({workflowPanelOpen: !this.state.workflowPanelOpen});
		}

		toggleWorkflowForm(state) {

			this.setState({workflowFormOpen: state});
		}

		toggleTaskForm(state) {

			this.setState({taskFormOpen: state})
		}


		toggleTaskPanel() {
			this.setState({taskPanelOpen: !this.state.taskPanelOpen});
		}

		workflowSelected(event, workflow) {
			
			this.setState({selectedWorkflow: workflow}, () => {
				
				this.engine.setModel(workflow.DIAGRAM)
				this.layoutEngine.redistribute(workflow.DIAGRAM);
				workflow.DIAGRAM.setZoomLevel(200)
				this.engine.repaintCanvas();

			});
		}

		onAddAction(taskName) {

			var task = this.state.selectedWorkflow.TASKS.filter((item) => item.NAME == taskName)[0];

			this.taskSelected({}, task, ()=> {

				this.toggleActionForm(true)

			});

		}

		addAction(data) {

		}

		taskSelected(event, task, callback = () => {}) {
		
			this.setState({selectedTask: task}, ()=> {

				var prevSelected = Object.values(this.state.selectedWorkflow.DIAGRAM.activeNodeLayer.models).filter((item) => item.options.selected == true);
				var node = Object.values(this.state.selectedWorkflow.DIAGRAM.activeNodeLayer.models).filter((item) => item.options.name == task.NAME)[0];
	
				for(var i in prevSelected) {
					prevSelected[i].setSelected(false)
				}
	
				node.setSelected()

				callback()

			});

		}

		async onUpload(e) {

			e.preventDefault()
			const reader = new FileReader()
			reader.onload = async (e) => { 
			  	const text = (e.target.result)
				
				var json = JSON.parse(text)

				var workflows = json.workflows;

				console.log(workflows)

				for(var i in workflows) {

					var newModel = new DiagramModel();
					//newModel.deserializeModel(workflowsp[i].DIAGRAM, this.engine);

					if(workflows[i].DIAGRAM) {

						newModel.deserializeModel(workflows[i].DIAGRAM, this.engine);
					}

					workflows[i].DIAGRAM = newModel;

				
					const nodes = workflows[i].DIAGRAM.getNodes();
					
					//  console.log(nodes)

					_.forEach(nodes, node => {
					  node.registerListener({
						eventDidFire: e => this.handleNodeEvent(e)
					  });
					});

				}

				this.setState({workflows: [...workflows]}, ()=> {
					this.engine.repaintCanvas();
				});
				
			};
			reader.readAsText(e.target.files[0])

		}

		onDownload() {

			var blob = {
				workflows: []
			}

			for (var i in this.state.workflows) {

				var tasks = []

				for(var j in this.state.workflows[i].TASKS) {

					tasks.push(
						
						{

							NAME: this.state.workflows[i].TASKS[j].NAME,
							ACTIONS: this.state.workflows[i].TASKS[j].ACTIONS,
							PARENTS: this.state.workflows[i].TASKS[j].PARENTS
						}
					)

				}

				blob.workflows.push(

					{
						TASKS: tasks,
						NAME: this.state.workflows[i].NAME,
						DESCRIPTION: this.state.workflows[i].DESCRIPTION
					}
				);
				
				if(this.state.workflows[i].DIAGRAM) {


					blob.workflows[i].DIAGRAM = this.state.workflows[i].DIAGRAM.serialize()
				}
			}

			const fileBlob = new Blob([JSON.stringify(blob, null, 2)], {type : 'application/json'});

			saveFile(fileBlob)
		}


		render() {

			return <Wrapper>

				<WorkflowForm 
                        workflows={this.state.workflows}
                        open={this.state.workflowFormOpen} 
                        onClose={() => this.toggleWorkflowForm(false)}
						onAdd={(data) => this.addWorkflow(data)}
        		/>

				<TaskForm 
                        tasks={(this.state.selectedWorkflow) ? this.state.selectedWorkflow.TASKS : null }
                        open={this.state.taskFormOpen} 
                        onClose={() => this.toggleTaskForm(false)}
						onAdd={(data) => this.addTask(data)}
        		/>

				<ActionForm 
                        actions={(this.state.selectedTask) ? this.state.selectedTask.ACTIONS : null }
                        open={this.state.actionFormOpen} 
                        onClose={() => this.toggleActionForm(false)}
						onAdd={(data) => this.addAction(data)}
        		/>

				<Header	
				
					onToggleWorkflowPanel={this.toggleWorkflowPanel.bind(this)} 
					onToggleTaskPanel={this.toggleTaskPanel.bind(this)}
					onDownload={this.onDownload.bind(this)}
					onUpload={this.onUpload.bind(this)}


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
											onAddAction={(taskName) => this.onAddAction(taskName)}
							/> 

					</TaskPanelWrapper>

					<CanvasWidget className="graphContainer" engine={this.engine} />

				</Columns>

			</Wrapper>
		}
}

export default App;
