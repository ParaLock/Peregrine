export function getWorkflow(id, workflows) {

    return workflows.filter((item) => item.ID == id)[0] ?? null;
    
}

export function getTask(id, workflow) {

    if(!workflow) {
        return null;
    }

    return workflow.TASKS.filter((item) => item.ID == id)[0] ?? null;
}

export function getAction(id, task) {

    if(!task) {
        return null;
    }

    return task.ACTIONS.filter((item) => item.ID == id)[0] ?? null;
}
