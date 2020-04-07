import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';




class TaskList extends React.Component {
  render() {
    let tasks = []
    return (<div>TaskList<hr/>{tasks}</div>);
    //return(
    //  <div className="tasklist">
    //  { /* insert repeated array of Task objects here */ }
    //</div>
  }
}

class Task extends React.Component {
  render() {
    // TODO: render the text in a nice table row, also with edit/update or delete buttons
    return (<div>Task [{this.props.content}] from date {this.props.date_created}</div>);
  } 
}

class TaskApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [
      {content: "Item #1", date_created: "2020-01-01"},
      {content: "Item #2", date_created: "2020-01-01"}]
    };
  }

  render() {

    let recent_status = "What just happened...";

    let tasklist = [];
    for (let i = 0; i < this.state.tasks.length; ++i) {
      tasklist.push(<Task
        content={this.state.tasks[i].content}
        date_created={this.state.tasks[i].date_created}
        />);
    }

    return (
      <div>
        <em>TaskApp Component</em><br/>
        Status: {recent_status}
        <hr/>
        
        {/* TODO: insert a table around this */}
        {tasklist}
        
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
    alert("Adding new task with contents [" + text + "]");
    // strip the text.
    this.createNewTask(text);
  }

  createNewTask(text) {
    this.setState({
      tasks: this.state.tasks.concat([{content: text, date_created: "2020-01-01"}])
    });
  }
}

// TODO implement me, first with state, then with the DB.
// read all tasks TODO()
// update task (text, id)
// delete task (id)


function Square(props) {
  const classes = props.isWinningSquare ? "square winningsquare" : "square";
  return (
    <button className={classes}
      onClick={props.onClick}
    >
    {props.value}
    </button>
    );
}

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
}


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
        {/* add the class 'reversed' to this element to reverse the list */}
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

  /* given a current board, and the previous board, return a string
   * describing the most recent move.*/
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
  }

// returns a tuple. first element is player that won: 'X' or 'O'
// second element is a 3 element array of squares they occupied to win.
// if no winner, we return null.
function calculateWinner(squares) {
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
}



// ========================================

ReactDOM.render(
  //  <Game />,
  <TaskApp/>,
  document.getElementById('root')
);

