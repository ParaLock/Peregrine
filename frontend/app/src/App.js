
import React from 'react';
import styled from 'styled-components';
import './App.css';

import WorkflowPanel from './Components/WorkflowPanel'
import Header from './Components/Header'
import WorkflowForm from './Components/WorkflowForm'

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
	flex-direction: row;
`;

const SidebarWrapper = styled.div`
    display: flex;
		position: absolute;
    border-radius: 16px;
    width: 400px;
		
    height: calc(100% - 50px);

		pointer-events:none;
`;


class App extends React.Component {

		constructor(props) {
				super(props)

				this.engine = createEngine();
				const node1 = new DefaultNodeModel({
					name: 'Node 1',
					color: 'rgb(0,192,255)',
				});
				node1.setPosition(100, 100);
				let port1 = node1.addOutPort('Out');

				const node2 = new DefaultNodeModel({
					name: 'Node 1',
					color: 'rgb(0,192,255)',
				});
				node2.setPosition(100, 100);
				let port2 = node2.addOutPort('Out');

				const link = port1.link<DefaultLinkModel>(port2);
				//link.addLabel('Hello World!');

				const model = new DiagramModel();
				model.addAll(node1, node2, link);
				this.engine.setModel(model);

				this.state = {
					sidebarOpen: false,
					selectedWorkflow: {},
					workflows: InitialWorkflows.workflows,
					workflowFormOpen: false
				}

		}

		addWorkflow(data) {

			var newWorkflow = {
				NAME: data.name,
				DESCRIPTION: data.description
			}

			this.setState({workflows: [...this.state.workflows, newWorkflow]}, 
			() => {

				this.workflowSelected({}, newWorkflow)

			});

			this.toggleWorkflowForm(false)

		}

		toggleSidebar() {

			this.setState({sidebarOpen: !this.state.sidebarOpen});
		}

		toggleWorkflowForm(state) {

			this.setState({workflowFormOpen: state});
		}

		workflowSelected(event, workflow) {

			this.setState({selectedWorkflow: workflow});
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

				<Header	onToggleSidebar={this.toggleSidebar.bind(this)} ></Header>

				<Columns>

					<SidebarWrapper>
							<WorkflowPanel 
											open={this.state.sidebarOpen}  
											workflowSelected={this.workflowSelected.bind(this)} 
											selectedWorkflow={this.state.selectedWorkflow} 
											workflows={this.state.workflows}
											onAddWorkflow={() => this.toggleWorkflowForm(true)}
							/> 
					</SidebarWrapper>

					<CanvasWidget className="graphContainer" engine={this.engine} />

				</Columns>

			</Wrapper>
		}
}

export default App;
