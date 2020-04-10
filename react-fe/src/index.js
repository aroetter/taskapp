import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function getInputHTMLElementIdByTaskId(id) {
  return "editTaskTextBox_" + id;
}

class Task extends React.Component {
  render() {
    let content, buttons
    if (this.props.isEditing) {
      // In editing mode, show the content as a text box
      // And give "Save" and "Cancel" buttons
      content = <input
        id={getInputHTMLElementIdByTaskId(this.props.id)}
        defaultValue={this.props.content}
      />
      buttons = <>
          <button onClick={this.props.onSaveButtonClick}>Save</button>
          <button onClick={this.props.onCancelButtonClick}>Cancel</button>
          </>
    } else {
      // In read mode, content is static text
      // Give "Edit" and "Delete" buttons
      content = this.props.content;
      buttons = <>
          <button onClick={this.props.onEditButtonClick}>Edit</button>
          <button onClick={this.props.onDeleteButtonClick}>Delete</button>
          </>
    }

    return (
      <tr>
        <td>{this.props.date_created}</td>
        <td>{content}</td>
        <td>Actions: {buttons}</td>
      </tr>);
  } 
}

class TaskApp extends React.Component {
  constructor(props) {
    super(props);
    // TODO: initial dummy state, remove
    this.state = {
      tasks: [
      {id:0, content: "Item #1", date_created: "2020-01-01"},
      {id: 1, content: "Item #2", date_created: "2020-02-02"}],
      nextId: 2,
      editing: new Set()
    };
    this.state.editing.add(1);
  }


  render() {

    let recent_status = "TODO: Set status to most recent action...";

    let tasklist = [];
    for (let i = 0; i < this.state.tasks.length; ++i) {
      console.log("Pushing task: id=" + this.state.tasks[i].id
        + ". content=" + this.state.tasks[i].content);
      tasklist.push(<Task
        key={this.state.tasks[i].id}
        id={this.state.tasks[i].id}
        content={this.state.tasks[i].content}
        date_created={this.state.tasks[i].date_created}
        onSaveButtonClick={() => {this.saveEditedTask(this.state.tasks[i].id);}}
        onCancelButtonClick={() => {this.cancelEditForTask(this.state.tasks[i].id);}}
        onEditButtonClick={() => {this.setTaskToEditingMode(this.state.tasks[i].id);}}
        onDeleteButtonClick={() => {this.deleteTask(this.state.tasks[i].id);}}
        isEditing={this.state.editing.has(this.state.tasks[i].id)}
        />);
    }

    return (
      <div>
        <h1 className="apptitle">Task App</h1>
        <div className="subtitle">Status: {recent_status}</div>
        <hr/>
        
        <table>
          <thead>
            <tr>
              <th>Date Created</th>
              <th>Contents</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasklist}
          </tbody>

        </table>
  
        
        <div className="tasklistfooter">
          Top of Footer Text
          <div>
              <input id="addTaskContents" type="text"/>
              <button onClick={() => this.handleAddTaskButtonClick()}>Add Task</button>
          </div>
        </div>
      </div>
    );
  }

  handleAddTaskButtonClick() {
    const text = document.getElementById("addTaskContents").value.trim();
    this.createNewTask(text);
  }

  deepCopyState(s) {
    let newTasks = [];
    for (let i = 0; i < s.tasks.length; ++i) {
      newTasks.push(Object.assign({}, s.tasks[i]));
    }
    let newState = {
      tasks: newTasks,
      nextId: s.nextId,
      editing: new Set(s.editing)
    }
    return newState
  }

  // TODO implement me, first with state, then with the DB.
  // read all tasks TODO()
  createNewTask(text) {
    console.log("createNewTask text=" + text
      + " using ID:" + this.state.nextId);

    let newState = this.deepCopyState(this.state);
    newState.tasks.push({
        id: this.state.nextId,
            content: text,
            date_created: "2020-01-01"});
    newState.nextId++;
    this.setState(newState);
  }


  saveEditedTask(id) {
    const newContent =
      document.getElementById(getInputHTMLElementIdByTaskId(id));

    let newState = this.deepCopyState(this.state);

    for(let i = 0; i < newState.tasks.length; ++i) {
      if (newState.tasks[i].id === id) {
        newState.tasks[i].content = newContent.value;
      }
    }
    // now save, aka remove this id from the 'editing' state
    newState.editing.delete(id);
    this.setState(newState);
  }

  cancelEditForTask(id) {
    console.log("in cancelEditForTask with id=" + id);
    let newState = this.deepCopyState(this.state);
    newState.editing.delete(id);
    this.setState(newState);
  }

  setTaskToEditingMode(id) {
    console.log("in setTaskToEditingMode with id=" + id);
    let newState = this.deepCopyState(this.state);
    newState.editing.add(id);
    this.setState(newState);
  }

  deleteTask(id) {
    console.log("In deleteTask with id=" + id);
    let newState = this.deepCopyState(this.state)
    newState.tasks = this.state.tasks.filter((t) => {return t.id !== id});
    this.setState(newState);
  }
}

// ========================================

ReactDOM.render(
  <TaskApp/>,
  document.getElementById('root')
);

