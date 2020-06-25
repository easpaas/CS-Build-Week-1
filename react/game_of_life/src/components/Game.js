import React from 'react'; 
import {Link} from 'react-router-dom';
import Cell from './Cell';
import './Game.css';

// Default game board values
const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;


// Game function
class Game extends React.Component {
  constructor() {
      super();
      this.rows = HEIGHT / CELL_SIZE;
      this.cols = WIDTH / CELL_SIZE;

      this.board = this.makeEmptyBoard();
  }

  state = {
      cells: [],
      isRunning: false,
      interval: 100,
  }

  /*
    Game Methods
  */

  makeEmptyBoard = () => {    
    let board = [];   
    // Create x and y axis
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];      
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }    
    } 
    return board;   
  }

  makeCells = () => {
    let cells = [];
    for(let y=0; y<this.rows; y++){
      for(let x=0; x<this.cols; x++){
        if (this.board[y][x]) {
          cells.push({x,y});
        }
      }
    }
    return cells;
  }

  getElementOffset = () => {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    return ({
      x: (rect.left + window.pageXOffset) - doc.clientLeft,
      y: (rect.top + window.pageYOffset) - doc.clientTop,
    });
  };

  handleClick = (event) => { 
    const elemOffset = this.getElementOffset();
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];    
    }

    this.setState({ cells: this.makeCells() });  
  }
  
  runGame = () => {
    this.setState({ isRunning: true });
    this.runIteration();
  }
  
  stopGame = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }
  
  runIteration = () => {
    let newBoard = this.makeEmptyBoard();

    for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
            let neighbors = this.calculateNeighbors(this.board, x, y);
            if (this.board[y][x]) {
                if (neighbors === 2 || neighbors === 3) {
                    newBoard[y][x] = true;
                } else {
                    newBoard[y][x] = false;
                }
            } else {
                if (!this.board[y][x] && neighbors === 3) {
                    newBoard[y][x] = true;
                }
            }
        }
    }

    this.board = newBoard;
    this.setState({ cells: this.makeCells() });
    
    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, this.state.interval);
  };
  
  //Calculate number of neighbors at x & y point
  calculateNeighbors = (board, x, y) => {
    let neighbors = 0;
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];

    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
        neighbors++;
      }
    }

    return neighbors;
  } 

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  }

  handleClear = () => {
    this.board = this.makeEmptyBoard();
    this.setState({ cells: this.makeCells() });
  }

  handleRandom = () => {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.board[y][x] = (Math.random() >= 0.5);
      }
    }
    this.setState({ cells: this.makeCells() });
  }

  render() {
    const { cells, interval, isRunning } = this.state;
    return (
      <>
        <div className="Header">
          <h1>Conway's Game of Life</h1>
          <Link to="/">
            <button className="button">Home</button>
          </Link>
        </div>

        <div className="Body">
          <div 
            className="Board"
            style={{ width: WIDTH, height: HEIGHT, backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`}}
            onClick={this.handleClick}
            ref={(n) => { this.boardRef = n }}
            >
            {
              // Map over cells array in state, pass props to Cell component
              cells.map(cell => (
                <Cell size={CELL_SIZE} x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`}/>
              ))
            }
          </div>

          <div className="Controls">
            <div className="control-top">
              <h2>Controls</h2>
              Update every  <br/>
              <input value={interval} onChange={this.handleIntervalChange} /> <br />
              msec
            </div>
            <div className="control-btm">
              {isRunning ?
                  <button className="button" onClick={this.stopGame}>Stop</button> :
                  <button className="button" onClick={this.runGame}>Run</button>
                }
              <button className="button" onClick={this.handleRandom}>Random</button>
              <button className="button" onClick={this.handleClear}>Clear</button>
            </div>
          </div>
        </div> 
      </>
    );
  }
}

export default Game;