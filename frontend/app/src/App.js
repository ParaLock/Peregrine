
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
import ParameterPanel from './Components/ParameterPanel';
import ParameterForm from './Components/ParameterForm';

import {getWorkflow, getTask, getAction} from './Common';

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

import { TaskNodeModel } from './Nodes/Task/TaskNodeModel';
import { TaskNodeFactory } from './Nodes/Task/TaskNodeFactory';

import { ParameterNodeModel } from './Nodes/Parameter/ParameterNodeModel';
import { ParameterNodeFactory } from './Nodes/Parameter/ParameterNodeFactory';

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

const ParameterPanelWrapper = styled.div`
	
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

			this.engine.getNodeFactories().registerFactory(new TaskNodeFactory());
			this.engine.getNodeFactories().registerFactory(new ParameterNodeFactory());


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
				openStates: {
					"log": false,
					"task_panel": false,
					"task_form": false,
					"action_panel": false,
					"action_form": false,
					"workflow_panel": false,
					"workflow_form": false,
					"conditional_panel": false,
					"conditional_form": false,
					"parameter_panel": false,
					"parameter_form": false
					 
				},

				selected: {
					"action": null,
					"task": null,
					"workflow": null,
					"conditional": null,
					"parameter": null
				},

				workflows: []
			}

			this.execServiceFactory = new ExecServiceFactory();

		}

		componentDidMount() {


		}

		select(name, id, callback = null) {

			var newState = {...this.state.selected}
			newState[name] = id;

			this.setState({selected: newState}, ()=> {

				if(callback) {

					callback();
				}
			});
		}

		getNode(id) {

			console.log(id)

			const nodes = getWorkflow(this.state.selected["workflow"], this.state.workflows).DIAGRAM.getNodes();
	
			var foundNode = null;

			_.forEach(nodes, node => {

				if(node.options.id == id) {
					foundNode = node;
				}
			
			});

			return foundNode;

		}


		handleNodeSelect(evt) {

			if(evt.isSelected) {

				this.select("task", evt.entity.options.id);

			} else {
				
				this.select("task", null);
			}
		}

		removeTask(id) {

			var newState = [...this.state.workflows]
			var workflow = getWorkflow(this.state.selected["workflow"], newState)

			removeIf(workflow.TASKS, (item) => {

				return item.ID == id;
			})

			this.setState({workflows: newState})
			
		}

		handleNodeEvent(evt) {

			if(evt.function == "selectionChanged") {
				this.handleNodeSelect(evt);
			}

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
				PARAMETERS: [],
				TASKS: [],
				DIAGRAM: new DiagramModel()
			}

			this.setState({workflows: [...this.state.workflows, newWorkflow]}, 
			() => {

				this.workflowSelected(id)

			});

			this.toggle("workflow_form", false, true)

		}

		onTaskReset(workflowId, taskId) {

			var task = getTask(taskId, getWorkflow(workflowId, this.state.workflows));

			task.STATE = "DORMENT";
			task.ACTION_IDX = -1;

			var node = this.getNode(taskId);
			node.setState("DORMENT");

			this.forceUpdate();
			this.engine.repaintCanvas();
			
		}

		onTaskExecute(workflowId, taskId) {

			var task = getTask(taskId, getWorkflow(workflowId, this.state.workflows));

			if(task.STATE !== "DORMENT") {

				return;
			}

			if(task.ACTIONS.length == 0) {

				return;
			}

			task.ACTION_IDX = 0;

			var node = this.getNode(task.ID);
			node.setState("RUNNING");
			task.STATE = "RUNNING";

			this.forceUpdate();
			this.engine.repaintCanvas();

			var action = task.ACTIONS[task.ACTION_IDX];

			var execService = this.execServiceFactory.getService(action.TYPE);

			var execNext = (response) => {

				if(response.MSG.TYPE == "COMPLETION_STATUS") {
					
					if(response.MSG.DETAIL.STATUS == "SUCCESS") {

						var node = this.getNode(task.ID);
						node.setState("SUCCESS")

					} else if (response.MSG.DETAIL.STATUS == "FAILED") {

						var node = this.getNode(task.ID);
						node.setState("FAILED");

						task.STATE = response.MSG.DETAIL.STATUS;

						this.forceUpdate();
						this.engine.repaintCanvas();

						return;
					}	

					task.STATE = response.MSG.DETAIL.STATUS;

					this.forceUpdate();
					this.engine.repaintCanvas();

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

			if(this.state.selected["workflow"]) {

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
						this.onTaskExecute(this.state.selected["workflow"], id);
					},
					onReset: () => {
						this.onTaskReset(this.state.selected["workflow"], id);
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
				
				var oldWorkflow = getWorkflow(this.state.selected["workflow"], oldState);

				oldWorkflow.TASKS.push(newTask);
				oldWorkflow.DIAGRAM.addNode(node);

				this.setState({workflows: oldState});

			}

			this.toggle("task_form", false, true)
		}

		toggleDiagramKeyShortcuts(state) {

			if(state) {

				this.engine.getActionEventBus().deregisterAction(this.deleteAction);

			} else {

				this.engine.getActionEventBus().registerAction(this.deleteAction);
			}
		}

		toggle(name, state = null, disableDiagramActions = false, otherToggles = []) {

			if(disableDiagramActions) {
				this.toggleDiagramKeyShortcuts(state);
			}

			var newState = {...this.state.openStates}


			if(state != null) {

				newState[name] = state;

			} else {

				newState[name] = !newState[name];
			}

			for(var i in otherToggles) {

				newState[otherToggles[i][0]] = otherToggles[i][1];
			}

			this.setState({openStates: newState});

		}

		toggleMany(items) {

			var newState = {...this.state.openStates}

			for(var i in items) {
	
				if(items[i].state != null) {
	
					newState[items[i].name] = items[i].state;
	
				} else {
	
					newState[items[i].name] = !newState[items[i].name];
				}
	
			}

			this.setState({openStates: newState});

		}

		workflowSelected(workflowId) {
			
			this.select("workflow", workflowId, () => {
				
				var workflow = getWorkflow(workflowId, this.state.workflows);

				this.engine.setModel(workflow.DIAGRAM)
				this.layoutEngine.redistribute(workflow.DIAGRAM);
				workflow.DIAGRAM.setZoomLevel(200)
				this.engine.repaintCanvas();

			});
		}

		actionSelected(workflowId, taskId, actionId) {

			this.taskSelected(workflowId, taskId, () => {

				this.select("action", actionId);

			});

		}

		parameterSelected(parameterId) {

			this.select("parameter", parameterId);
		}

		onAddAction(id) {
			

			this.taskSelected(this.state.selected["workflow"], id, ()=> {

				this.toggle("action_form", true, true)
			});

		}

		onAddParameter(id) {

			
			this.toggle("parameter_form", true, true)
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

			var task = getTask(this.state.selected["task"], getWorkflow(this.state.selected["workflow"], oldWorkflows))

			if(task.STATE == "RUNNING") {

				return;
			}

			task.ACTIONS.push(newAction);

			this.setState({workflows: oldWorkflows});

			this.toggle("action_form", false, true)

		}

		onWorkflowExecute(workflowId) {

			var workflow = getWorkflow(workflowId, this.state.workflows);

			const nodes = workflow.DIAGRAM.getNodes();

			var startingNodes = [];

			_.forEach(nodes, node => {

				if(node.options.type == "Task") {

					console.log(node);

					var inport = node.getInPorts();
	
					console.log(inport)
				}

			});

			console.log(startingNodes);

		}

		addParameter(data) {

			var id = uuidv4();

			var newParameter = {
				NAME: data.name,
				ID: id,
				TYPE: data.type
			}

			const node = new ParameterNodeModel({
				name: data.name,
				id: id,
				color: 'rgb(0,192,255)',		
				onExecute: () => {
					//this.onTaskExecute(this.state.selected["workflow"], id);
				},
				onReset: () => {
					//this.onTaskReset(this.state.selected["workflow"], id);
				}
			});



			node.registerListener({
				eventDidFire: (evt) => {
					this.handleNodeEvent(evt)
				}
			});

			var oldWorkflows = [...this.state.workflows];
			var workflow = getWorkflow(this.state.selected["workflow"], oldWorkflows);

			workflow.DIAGRAM.addNode(node);
			workflow.PARAMETERS.push(newParameter);

			this.setState({workflows: oldWorkflows});
			this.toggle("parameter_form", false, true)
		}

		taskSelected(workflowId, taskId, callback = () => {}) {
		
			this.select("task", taskId, ()=> {

				var selectedWorkflow = getWorkflow(workflowId, this.state.workflows);

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
					var nodeResetFuncs = {}

					var newModel = new DiagramModel();
					//newModel.deserializeModel(workflowsp[i].DIAGRAM, this.engine);

					if(workflows[i].DIAGRAM) {

						newModel.deserializeModel(workflows[i].DIAGRAM, this.engine);
					}

					if(!("ID" in workflows[i])) {
						workflows[i]["ID"] = uuidv4();
					}

					if(!("PARAMETERS" in workflows[i])) {
						workflows[i]["PARAMETERS"] = [];
					}

					for(var j in workflows[i].TASKS) {

						var task = workflows[i].TASKS[j];

						if(!("ID" in task)) {

							task["ID"] = uuidv4();
						}

						var t = function(wId, tId, self) {

							return () => self.onTaskExecute(wId, tId);
						} 

						var t2 = function(wId, tId, self) {

							return () => self.onTaskReset(wId, tId);
						} 

						nodeExecFuncs[task["ID"]] = t(workflows[i].ID, task.ID, this)
						nodeResetFuncs[task["ID"]] = t2(workflows[i].ID, task.ID, this)

						for(var k in task.ACTIONS) {

							if(!("ID" in task.ACTIONS[k])) {
								task.ACTIONS[k].ID = uuidv4()
							}
						}
					}

					workflows[i].DIAGRAM = newModel;

					const nodes = workflows[i].DIAGRAM.getNodes();

					_.forEach(nodes, node => {

						node.options.onExecute = nodeExecFuncs[node.options.id];
						node.options.onReset = nodeResetFuncs[node.options.id];

						if(!node.options.onExecute || !node.options.onReset) {

							node.options.onExecute = (workspaceId, taskId) => {}
							node.options.onReset = (workspaceId, taskId) => {}
						}

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
							ACTIONS: [...this.state.workflows[i].TASKS[j].ACTIONS],
							ACTION_IDX: this.state.workflows[i].TASKS[j].ACTION_IDX,
							STATE: this.state.workflows[i].TASKS[j].STATE
							
						}
					)

				}

				blob.workflows.push(

					{
						TASKS: tasks,
						PARAMETERS: this.state.workflows[i].PARAMETERS,
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
                        model={this.state.workflows}
                        open={this.state.openStates["workflow_form"]} 
                        onClose={() => this.toggle("workflow_form", false, true)}
						onAdd={(data) => this.addWorkflow(data)}
        		/>

				<TaskForm 
						selected={this.state.selected}
						model={this.state.workflows}
                        open={this.state.openStates["task_form"]} 
                        onClose={() => this.toggle("task_form", false, true)}
						onAdd={(data) => this.addTask(data)}
        		/>

				<ActionForm 
						selected={this.state.selected}
						model={this.state.workflows}
                        open={this.state.openStates["action_form"]} 
                        onClose={() => this.toggle("action_form", false, true)}
						onAdd={(data) => this.addAction(data)}
        		/>

				<ParameterForm 
						selected={this.state.selected}
						model={this.state.workflows}
                        open={this.state.openStates["parameter_form"]} 
                        onClose={() => this.toggle("parameter_form", false, true)}
						onAdd={(data) => this.addParameter(data)}
        		/>

				<Header	
				
					toggle={this.toggle.bind(this)}
					toggleMany = {this.toggleMany.bind(this)}
					onDownload={this.onDownload.bind(this)}
					onUpload={this.onUpload.bind(this)}


				></Header>

				<Columns logOpen={this.state.openStates["log_panel"]}>

					<WorkflowPanelWrapper open={this.state.openStates["workflow_panel"]} logOpen={this.state.openStates["log"]}>
							<WorkflowPanel 
											open={this.state.openStates["workflow_panel"]}  
											selected={this.state.selected}
											model={this.state.workflows}
											onClose={() => this.toggle("workflow_form", false, true)}
											onAddWorkflow={() => this.toggle("workflow_form", true, true)}
											workflowSelected={(id) => this.workflowSelected(id)}
											onWorkflowExecute={(id) => this.onWorkflowExecute(id)}
							/> 
					</WorkflowPanelWrapper>

					<TaskPanelWrapper open={this.state.openStates["task_panel"]} logOpen={this.state.openStates["log"]}>

							<TaskPanel 
											open={this.state.openStates["task_panel"]}  
											taskSelected={this.taskSelected.bind(this)} 
											actionSelected={this.actionSelected.bind(this)}
											selected={this.state.selected}
											model={this.state.workflows}
											onAddTask={() => this.toggle("task_form", true, true)}
											onAddAction={(taskId) => this.onAddAction(taskId)}
							/> 

					</TaskPanelWrapper>

					<ParameterPanelWrapper open={this.state.openStates["parameter_panel"]} logOpen={this.state.openStates["log"]}> 
					
						<ParameterPanel

							open={this.state.openStates["parameter_panel"]}  
							parameterSelected={this.parameterSelected.bind(this)} 
							selected={this.state.selected}
							model={this.state.workflows}
							onAddParameter={(paramId) => this.onAddParameter(paramId)}
						
						/>

					</ParameterPanelWrapper>

					<CanvasWidget className="graphContainer" engine={this.engine} />

				</Columns>

				<React.Fragment key={"bottom"}>
					<Drawer variant={"persistent"} anchor={"bottom"} open={this.state.openStates["log"]}>
						<Log execServiceFactory={this.execServiceFactory} />
					</Drawer>
				</React.Fragment>

			</Wrapper>
		}
}

export default App;
