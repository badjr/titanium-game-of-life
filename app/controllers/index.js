$.index.open(); //Opens this window.

// require('GameOfLifeModel');

var tableRows = 10;
var tableCols = 10;
var tableHeight = 10;
var tableWidth = 10;
var tableTop = 10;
var tableLeft = 10;
var numLiveCells = 0;

var tableView = []; //Array holding the View elements that make up the table.




var gameActive = false;

var gameInterval; //Variable that setInterval() assigns to.
				  //Needed to cancel the interval with clearInterval(gameInterval)
				  

var GameOfLifeModel = require('GameOfLifeModel');
var model = new GameOfLifeModel(10, 10);
$.label.text = "num rows = " + model.getNumRows();

// var model = Alloy.createModel('GameOfLifeModel');
// var model = require('../models/GameOfLifeModel');
// $.label.text = "num rows = " + model.getNumRows;
// var gameGrid = model.get('theModel');
// $.label.text = "num rows = " + model.get('numRows');
// $.label.text = "num rows = " + gameGrid.getNumRows();

function doClick(e) {
	if (this.id == 'label') {
    	alert($.label.text);
    }
    else if (this.id == 'startButton') {
    	if (!gameActive) {
    		startGame();
    	}
    	else {
    		stopGame();
    	}
    }
}

function startGame(e) {
		$.startButton.title = "Stop";
		gameActive = true;
		gameInterval = setInterval(tick, 500);
}

function stopGame(e) {
	$.startButton.title = "Start";
	gameActive = false;
	clearInterval(gameInterval);
}

function toggleCell(e) {
	this.toggleBackground();
}

for (var i=0; i < tableRows; i++) {
	for (var j=0; j < tableCols; j++) {
			 var view = Titanium.UI.createView({
			 	height:tableHeight,
			 	width:tableWidth,
			 	backgroundColor:'white',
			 	borderColor:'black',
			 	borderWidth:1,
			 	top:tableTop + tableHeight*i,
			 	left:tableLeft + tableWidth*j,
			 	row:i,
			 	col:j,
			 	toggleBackground: function() {
			 		if (this.backgroundColor == 'white') {
			 			this.backgroundColor = 'blue';
			 			numLiveCells++;
			 		}
			 		else {
			 			this.backgroundColor = 'white';
			 			numLiveCells--;
			 		}
			 		// $.label.text = "numLiveCells = " + numLiveCells;
			 	}
			 });
			 
			 view.addEventListener('click', toggleCell);
			 tableView.push(view);
			 
			 $.index.add(view);
	};
};
tableView[8 + 10*8].toggleBackground();
// $.label.text = "numCellsAlive = " + numLiveCells;

//logic
function cellExistsAt(i, j) {
	return tableView[i + 10*j].backgroundColor == 'blue';
}

function cellAliveNextTickAt(i, j) {
	var numNeighbors = 0;
	var isAlive = cellExistsAt(i, j);
	
	if (i > 0 && cellExistsAt(i - 1, j)) {
		numNeighbors++;
	}
	if (i > 0 && j > 0 && cellExistsAt(i - 1, j - 1)) {
		numNeighbors++;//top_left neighbor
	}
    if (i > 0 && j < tableWidth - 1 && cellExistsAt(i - 1, j + 1)) {
		numNeighbors++;//top_right neighbor
    }
    if (j > 0 && cellExistsAt(i, j - 1)) {
		numNeighbors++;//left neighbor
    }
    if (j < tableWidth - 1 && cellExistsAt(i, j + 1)) {
		numNeighbors++;//right neighbor
    }
    if (i < tableHeight - 1 && cellExistsAt(i + 1, j)) {
		numNeighbors++;//bottom neighbor
    }
    if (i < tableHeight - 1 && j > 0 && cellExistsAt(i + 1, j - 1)) {
		numNeighbors++;//bottom_left neighbor
    }
    if (i < tableHeight - 1 && j < tableWidth - 1 && cellExistsAt(i + 1, j + 1)) {
		numNeighbors++;//bottom_right neighbor
    }
    return (
    	(isAlive && (numNeighbors == 2 || numNeighbors == 3))
		||
		(!isAlive && numNeighbors == 3));
}

function tick() {
	if (numLiveCells == 0) {
    	stopGame();
    }
    //the survival table is used to determine if a cell is occupied or not
    //for the next time unit
    var survivalTable = [];

    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            if (cellAliveNextTickAt(i, j)) {
                survivalTable[i + 10*j] = 1;
            }
            else {
                survivalTable[i + 10*j] = 0;
            }
        }
    }

    //Use survival table to adjust game table for next time unit
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            if (survivalTable[i + 10*j] == 1) {
            	if (!cellExistsAt(i, j)) {
                	tableView[i + 10*j].backgroundColor = 'blue';
                	numLiveCells++;
				}
            }
            else {
            	if (cellExistsAt(i, j)) {
                	tableView[i + 10*j].backgroundColor = 'white';
                	numLiveCells--;
				}
            }
        }
    }
    
    $.label.text = "numLiveCells = " + numLiveCells;
    
}
