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

    let recent_status = "TODO What just happened...";

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


  // TODO implement me, first with state, then with the DB.
  // read all tasks TODO()
  createNewTask(text) {
    console.log("createNewTask text=" + text
      + " using ID:" + this.state.nextId);
    this.setState({
      tasks: this.state.tasks.concat(
        [{id: this.state.nextId,
          content: text,
          date_created: "2020-01-01"}]),
      nextId: this.state.nextId + 1,
      editing: this.state.editing
    });
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

  /* TODO TODO TODO DO THIS NEXT */
  setTaskToEditingMode(id) {
    console.log("in setTaskToEditingMode with id=" + id);
    let newState = this.deepCopyState(this.state);
    newState.editing.add(id);
    this.setState(newState);
  }

  // TODO: replace this with a call to deepcopy then modify.
  // TODO: do same for other calls to setState
  deleteTask(id) {
    // TODO: do an actual delete.
    // Filter the TODO lists.
    // TODO TODO TODO START HERE... Add an ID element here...
    console.log("In deleteTask with id=" + id);
    let newtasks = this.state.tasks.filter((t) => {return t.id !== id});
    this.setState({
      tasks: newtasks,
      nextId: this.state.nextId,
      editing: this.state.editing
    });
  }
}



/*
function Square(props) {
  const classes = props.isWinningSquare ? "square winningsquare" : "square";
  return (
    <button className={classes}
      onClick={props.onClick}
    >
    {props.value}
    </button>
    );
}*/

/*
class Board extends React.Component {
  renderSquare(i, isWinningSquare) {
    return (
      <Square
        key={i}
        isWinningSquare={isWinningSquare}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
    />
    );
  }

  render() {
    const boardDim = 3;
    let board = [];
    for (let i = 0; i < boardDim; ++i) {
      let curRow = [];
      for (let j = 0; j < boardDim; ++j) {
        const squareNum = i * boardDim + j;
        const isWinningSquare = ((this.props.winningsquares != null)
          && this.props.winningsquares.includes(squareNum));
        curRow.push(this.renderSquare(squareNum, isWinningSquare));
      }
      board.push(<div key={i} className="board-row">{curRow}</div>);
    }
    return (<div>{board}</div>);
  }
}*/

/*
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };

  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const res = calculateWinner(current.squares);
    const winner = (res != null) ? res[0] : null;
    const winningSquares = (res != null) ? res[1] : null; 
    
    const moves = history.map((step, move) => {
      const desc = move > 0 ? 'Go to move #' + move : 'Go to start';

      const what_happened = (0 === move) ? "No move yet." :
      computeLastMove(
        history[move].squares,
        history[move-1].squares);

      const listItemClass = (move === this.state.stepNumber) ?
        "selectedMove" : "unselectedMove";

      return (
        <li className={listItemClass} key={move}>
                  <button onClick={() => this.jumpTo(move)}>{desc}</button> {what_happened}
        </li>
        );
    });

    // Compute Game Status
    let status;
    if (winner === null && (9 === this.state.stepNumber)) {
      status = "Game is a draw.";
    } else if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // Render current board
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winningsquares = {winningSquares}
            squares = {current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>

          <div>
            <label className="switch">
              <input id="ascendingSortCheckbox" defaultChecked type="checkbox" onChange={(e) => this.handleSortCheckboxClick(e)}/>
              Ascending Move Order
            </label>
          </div>
          <ol id="orderedListOfMoves">{moves}</ol>
        </div>
      </div>
    );
  }

  handleSortCheckboxClick(e) {
    const foo = document.getElementById("ascendingSortCheckbox")
    if (!foo.checked) {
      document.getElementById("orderedListOfMoves").classList.add("reversed");
    } else {
      document.getElementById("orderedListOfMoves").classList.remove("reversed");
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    // if someone has one, or square is filled, ignore
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,

    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
}
*/

  /* given a current board, and the previous board, return a string
   * describing the most recent move.*/
  /*
  function computeLastMove(cur, prev) {
    //let tmp = 0;
    let row = null, col = null;
    let played = null;
    cur.forEach((element, index) => {
      if (element !== prev[index]) {
        // found it
        played = element;
        row = Math.floor(index / 3);
        col = index % 3;
      }
    });
    return played + " played on row " + (row+1) + ", col " + (col+1);
  }*/

// returns a tuple. first element is player that won: 'X' or 'O'
// second element is a 3 element array of squares they occupied to win.
// if no winner, we return null.
/*function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // e.g. if X won on squares 0,3, and 6, then return ['X', [0, 3, 6]];
        return [squares[a], lines[i]]; 
    }
  }
  return null;
}*/



// ========================================

ReactDOM.render(
  <TaskApp/>,
  document.getElementById('root')
);

