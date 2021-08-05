
import React from 'react';
import styled from 'styled-components';
import './App.css';

import WorkflowPanel from './Components/WorkflowPanel'
import Header from './Components/Header'
import WorkflowForm from './Components/WorkflowForm'
import TaskForm from './Components/TaskForm'
import TaskPanel from './Components/TaskPanel'
import ActionForm from './Components/ActionForm'
import Drawer from '@material-ui/core/Drawer';
import LogViewer from './Components/LogViewer';
import Log from './Components/Log';
import ExecServiceFactory from './ExecutionEngine/ExecServices/ExecServiceFactory';

import _ from 'lodash'

import createEngine, { 
	DefaultLinkModel, 
	DefaultNodeModel,
	DiagramModel,
	NodeModel,
	DagreEngine,
	DiagramEngine,
	PathFindingLinkFactory,
	PortModelAlignment
} from '@projectstorm/react-diagrams';

import {CanvasWidget, DeleteItemsAction } from '@projectstorm/react-canvas-core';

import { TaskNodeModel } from './Nodes/TaskNodeModel';
import { TaskNodeFactory } from './Nodes/TaskNodeFactory';
import { SimplePortFactory } from './Nodes/SimplePortFactory';


const Wrapper = styled.div`
		width: 100%;
		height: 100%;
		background-image: linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.05) 75%, rgba(255, 255, 255, 0.05) 76%, transparent 77%, transparent);
		background-color: rgb(60, 60, 60);
		background-size: 50px 50px;
`;

const Columns = styled.div `

	width: 100%;
	height: calc(100% - ${Header.HEIGHT + "px"});
	display: flex;

	overflow:hidden;
	flex-direction: column;
`;

const WorkflowPanelWrapper = styled.div`
    display: flex;
	position: absolute;
    border-radius: 16px;
    width: 250px;
		
	transform: ${props => props.open ? "translateX(0%)" : "translateX(-100%)"};
	transition: opacity 250ms, transform 250ms ease-in-out, max-width 250ms, max-height 250ms ease-in;

	opacity: ${props => props.open ? "1" : "0"};

	z-index: 1000;
	height: 100%;
    max-height:  ${props => props.logOpen ? "calc(100% - " + (Header.HEIGHT + Log.HEIGHT) + "px)" : "calc(100% - " + Header.HEIGHT + "px)"};

	pointer-events:none;
`;

const TaskPanelWrapper = styled.div`
	
	display: flex;
	position: absolute;
	overflow:hidden;
	right: 0;
	width: 250px;
	max-width: ${props => props.open ? "100%" : "0%"};
	transform: ${props => props.open ? "translateX(0%)" : "translateX(100%)"};
	transition: opacity 250ms, transform 250ms ease-in-out, max-width 250ms, max-height 250ms ease-in;
	opacity: ${props => props.open ? "1" : "0"};
	z-index: 1000;
	height: 100%;
    max-height:  ${props => props.logOpen ? "calc(100% - " + (Header.HEIGHT + Log.HEIGHT) + "px)" : "calc(100% - " + Header.HEIGHT + "px)"};
	pointer-events:none;
`;

const saveFile = async (blob) => {
	const a = document.createElement('a');

	var d = new Date().toISOString().split('T')[0]

	a.download = "peregrin-session-" + d  + '.json';
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

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
}



class App extends React.Component {

		constructor(props) {
			super(props)

			this.engine = createEngine({ registerDefaultDeleteItemsAction: false });

			this.deleteAction = new DeleteItemsAction({ keyCodes: [46] });

			this.engine.getActionEventBus().registerAction(this.deleteAction);

			// this.engine
			// 	.getPortFactories()
			// 	.registerFactory(new SimplePortFactory('Task', (config) => new TaskPortModel(PortModelAlignment.LEFT)));
			this.engine.getNodeFactories().registerFactory(new TaskNodeFactory());

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

			this.engine.setModel(this.model);

			this.state = {
				logPanelOpen: false,
				workflowPanelOpen: false,
				taskPanelOpen: false,
				taskFormOpen: false,
				actionFormOpen: false,
				actionPanelOpen: false,
				selectedActionId: null,
				selectedTaskId: null,
				selectedWorkflowId: null,
				workflows: [],
				workflowFormOpen: false
			}

			this.execServiceFactory = new ExecServiceFactory();

		}

		componentDidMount() {


		}

		getNode(id) {

			console.log(id)

			const nodes = this.getWorkflow(this.state.selectedWorkflowId).DIAGRAM.getNodes();
	
			var foundNode = null;

			_.forEach(nodes, node => {

				if(node.options.id == id) {
					foundNode = node;
				}
			
			});

			return foundNode;

		}

		getWorkflow(id, workflows = null) {

			if(workflows) {

				return workflows.filter((item) => item.ID == id)[0] ?? null;
			}

			return this.state.workflows.filter((item) => item.ID == id)[0] ?? null;
		}

		getTask(id, workflow) {

			if(!workflow) {
				return null;
			}

			return workflow.TASKS.filter((item) => item.ID == id)[0] ?? null;
		}

		getAction(id, task) {

			if(!task) {
				return null;
			}

			return task.ACTIONS.filter((item) => item.ID == id)[0] ?? null;
		}

		handleNodeSelect(evt) {

			if(evt.isSelected) {

				this.setState({selectedTaskId: evt.entity.options.id});

			} else {
				
				this.setState({selectedTaskId: null});
			}
		}

		removeTask(id) {

			var newState = [...this.state.workflows]
			var workflow = this.getWorkflow(this.state.selectedWorkflowId, newState)

			removeIf(workflow.TASKS, (item) => {

				return item.ID == id;
			})

			this.setState({workflows: newState})
			
		}

		handleNodeEvent(evt) {

			if(evt.function == "selectionChanged") {
				this.handleNodeSelect(evt);
			}

			//Aweful hack needed here because for some reason this event fires randomly when typing in form.
			if(evt.function == "entityRemoved") {

				this.removeTask(evt.entity.options.id)
			}
		}

		addWorkflow(data) {

			var id = uuidv4();

			var newWorkflow = {
				NAME: data.name,
				ID: id,
				DESCRIPTION: data.description,
				TASKS: [],
				DIAGRAM: new DiagramModel()
			}

			this.setState({workflows: [...this.state.workflows, newWorkflow]}, 
			() => {

				this.workflowSelected(id)

			});

			this.toggleWorkflowForm(false)

		}

		onTaskExecute(workflowId, taskId) {

			var task = this.getTask(taskId, this.getWorkflow(workflowId));

			if(task.STATE == "RUNNING") {

				return;
			}

			if(task.ACTIONS.length == 0) {

				return;
			}

			task.ACTION_IDX = 0;

			var action = task.ACTIONS[task.ACTION_IDX];

			var execService = this.execServiceFactory.getService(action.TYPE);

			var execNext = (response) => {

				if(response.MSG.TYPE == "COMPLETION_STATUS") {
					
					if(response.MSG.DETAIL.STATUS == "SUCCESS") {

						var node = this.getNode(task.ID);
						node.options.color = 'rgb(100, 167, 11)';

					} else if (response.MSG.DETAIL.STATUS == "FAILED") {

						var node = this.getNode(task.ID);
						node.options.color = 'rgb(100, 0, 0)';

						task.STATE = response.MSG.DETAIL.STATUS;

						this.engine.repaintCanvas();
						this.forceUpdate();

						return;
					}	

					task.STATE = response.MSG.DETAIL.STATUS;

					this.engine.repaintCanvas();
					this.forceUpdate();

					if(task.ACTION_IDX > (task.ACTIONS.length - 1)) {

						task.ACTION_IDX = -1;

						return;
					}

					action = task.ACTIONS[task.ACTION_IDX];

					task.ACTION_IDX++;
					
					execService.execute(action.DETAILS.CMD, action.NAME, execNext);
				}
			}

			task.ACTION_IDX++;

			if(execService) {

				execService.execute(action.DETAILS.CMD, action.NAME, execNext);
			}

		}

		addTask(data) {

			if(this.state.selectedWorkflowId) {

				var id = uuidv4();

				var newTask = {
					NAME: data.name,
					ID: id,
					STATE: "DORMENT",
					ACTION_IDX: -1,
					ACTIONS: []
				}

				const node = new TaskNodeModel({
					name: data.name,
					id: id,
					color: 'rgb(0,192,255)',		
					onExecute: () => {
						this.onTaskExecute(this.state.selectedWorkflowId, id);
					}
				});

				node.registerListener({
					eventDidFire: (evt) => {
						this.handleNodeEvent(evt)
					}
				});

				var input = node.addInPort('IN');
				var output = node.addOutPort('OUT');

				var oldState = [...this.state.workflows];
				
				var oldWorkflow = this.getWorkflow(this.state.selectedWorkflowId, oldState);

				oldWorkflow.TASKS.push(newTask);
				oldWorkflow.DIAGRAM.addNode(node);

				this.setState({workflows: oldState});

			}

			this.toggleTaskForm(false)
		}

		toggleDiagramKeyShortcuts(state) {

			if(state) {

				this.engine.getActionEventBus().deregisterAction(this.deleteAction);

			} else {

				this.engine.getActionEventBus().registerAction(this.deleteAction);
			}
		}

		toggleActionForm(state) {
			
			this.toggleDiagramKeyShortcuts(state);
			this.setState({actionFormOpen: state});
		}

		toggleWorkflowPanel() {

			this.setState({workflowPanelOpen: !this.state.workflowPanelOpen});
		}

		toggleWorkflowForm(state) {

			this.toggleDiagramKeyShortcuts(state);
			this.setState({workflowFormOpen: state});
		}

		toggleTaskForm(state) {

			this.toggleDiagramKeyShortcuts(state);
			this.setState({taskFormOpen: state})
		}


		toggleTaskPanel() {
			this.setState({taskPanelOpen: !this.state.taskPanelOpen});
		}

		toggleLogPanel() {
			this.setState({logPanelOpen: !this.state.logPanelOpen});
		}

		workflowSelected(workflowId) {
			

			this.setState({selectedWorkflowId: workflowId}, () => {
				
				var workflow = this.getWorkflow(workflowId);

				this.engine.setModel(workflow.DIAGRAM)
				this.layoutEngine.redistribute(workflow.DIAGRAM);
				workflow.DIAGRAM.setZoomLevel(200)
				this.engine.repaintCanvas();

			});
		}

		actionSelected(workflowId, taskId, actionId) {

			var workflow = this.getWorkflow(workflowId);
			//var task = this.getTask(taskId, workflow);

			this.taskSelected(workflowId, taskId, () => {
				this.setState({selectedActionId: actionId}, () => {
				
					//var workflow = this.getWorkflow(workflowId);
	
				});
			});

		}

		onAddAction(id) {
			

			this.taskSelected(this.state.selectedWorkflowId, id, ()=> {

				this.toggleActionForm(true)

			});

		}

		addAction(data) {

			var newAction = {
				NAME: data.name,
				TYPE: data.type,
				ID: uuidv4(),
				DETAILS: {

					CMD: data.bash_cmd
				}
			}

			var oldWorkflows = [...this.state.workflows];

			var task = this.getTask(this.state.selectedTaskId, this.getWorkflow(this.state.selectedWorkflowId, oldWorkflows))

			if(task.STATE == "RUNNING") {

				return;
			}

			task.ACTIONS.push(newAction);

			this.setState({workflows: oldWorkflows});

			this.toggleActionForm(false)

		}

		taskSelected(workflowId, taskId, callback = () => {}) {
		
			this.setState({selectedTaskId: taskId}, ()=> {

				var selectedWorkflow = this.getWorkflow(workflowId);

				var prevSelected = Object.values(selectedWorkflow.DIAGRAM.activeNodeLayer.models).filter((item) => item.options.selected == true);
				var node = Object.values(selectedWorkflow.DIAGRAM.activeNodeLayer.models).filter((item) => item.options.id == taskId)[0];
	
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

					var nodeExecFuncs = {}

					var newModel = new DiagramModel();
					//newModel.deserializeModel(workflowsp[i].DIAGRAM, this.engine);

					if(workflows[i].DIAGRAM) {

						newModel.deserializeModel(workflows[i].DIAGRAM, this.engine);
					}

					if(!("ID" in workflows[i])) {
						workflows[i]["ID"] = uuidv4();
					}

					for(var j in workflows[i].TASKS) {

						var task = workflows[i].TASKS[j];

						if(!("ID" in task)) {

							task["ID"] = uuidv4();
						}

						for(var k in task.ACTIONS) {

							if(!("ID" in task.ACTIONS[k])) {
								task.ACTIONS[k].ID = uuidv4()
							}

							nodeExecFuncs[task["ID"]] = () => {
								this.onTaskExecute(workflows[i].ID, task.ID);
							}
						}
					}

					workflows[i].DIAGRAM = newModel;

					
					const nodes = workflows[i].DIAGRAM.getNodes();
					
					//  console.log(nodes)

					_.forEach(nodes, node => {

						node.options.onExecute = nodeExecFuncs[node.options.id];

						node.registerListener({
							eventDidFire: e => this.handleNodeEvent(e)	
						});
					});

				}

				this.setState({workflows: [...workflows]}, ()=> {
					this.engine.repaintCanvas();
				});
				
			};

			try {

				reader.readAsText(e.target.files[0])
			} catch(e) {

				alert("Failed to import workspace.");
			}


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
							ID: this.state.workflows[i].TASKS[j].ID,
							ACTIONS: this.state.workflows[i].TASKS[j].ACTIONS,
							ACTION_IDX: this.state.workflows[i].TASKS[j].ACTION_IDX,
							STATE: this.state.workflows[i].TASKS[j].STATE
							
						}
					)

				}

				blob.workflows.push(

					{
						TASKS: tasks,
						NAME: this.state.workflows[i].NAME,
						DESCRIPTION: this.state.workflows[i].DESCRIPTION,
						ID: this.state.workflows[i].ID
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
                        tasks={(this.state.selectedWorkflowId) ? this.getWorkflow(this.state.selectedWorkflowId) : null }
                        open={this.state.taskFormOpen} 
                        onClose={() => this.toggleTaskForm(false)}
						onAdd={(data) => this.addTask(data)}
        		/>

				<ActionForm 
                        actions={(this.state.selectedTaskId) ? this.getTask(this.state.selectedTaskId, this.getWorkflow(this.state.selectedWorkflowId)) : null }
                        open={this.state.actionFormOpen} 
                        onClose={() => this.toggleActionForm(false)}
						onAdd={(data) => this.addAction(data)}
        		/>

				<Header	
				
					onToggleWorkflowPanel={this.toggleWorkflowPanel.bind(this)} 
					onToggleTaskPanel={this.toggleTaskPanel.bind(this)}
					onToggleLog={this.toggleLogPanel.bind(this)}
					onDownload={this.onDownload.bind(this)}
					onUpload={this.onUpload.bind(this)}



				></Header>

				<Columns logOpen={this.state.logPanelOpen}>

					<WorkflowPanelWrapper open={this.state.workflowPanelOpen} logOpen={this.state.logPanelOpen}>
							<WorkflowPanel 
											open={this.state.workflowPanelOpen}  
											workflowSelected={this.workflowSelected.bind(this)} 
											selectedWorkflow={this.getWorkflow(this.state.selectedWorkflowId)} 
											workflows={this.state.workflows}
											onAddWorkflow={() => this.toggleWorkflowForm(true)}
							/> 
					</WorkflowPanelWrapper>

					<TaskPanelWrapper open={this.state.taskPanelOpen} logOpen={this.state.logPanelOpen}>

							<TaskPanel 
											open={this.state.taskPanelOpen}  
											taskSelected={this.taskSelected.bind(this)} 
											selectedWorkflow={this.getWorkflow(this.state.selectedWorkflowId)} 
											selectedTask={this.getTask(this.state.selectedTaskId, this.getWorkflow(this.state.selectedWorkflowId)) }
											selectedAction={this.getAction(this.state.selectedActionId, this.getTask(this.state.selectedTaskId, this.getWorkflow(this.state.selectedWorkflowId))) }
											onAddTask={() => this.toggleTaskForm(true)}
											onAddAction={(taskName) => this.onAddAction(taskName)}
											actionSelected={this.actionSelected.bind(this)}
							/> 

					</TaskPanelWrapper>

					<CanvasWidget className="graphContainer" engine={this.engine} />

				</Columns>

				<React.Fragment key={"bottom"}>
					<Drawer variant={"persistent"} anchor={"bottom"} open={this.state.logPanelOpen}>
						<Log execServiceFactory={this.execServiceFactory} />
					</Drawer>
				</React.Fragment>

			</Wrapper>
		}
}

export default App;
