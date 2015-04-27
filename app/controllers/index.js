$.index.open(); //Opens this window.

var tableRows = 20;
var tableCols = 20;
var tableHeight = 10;
var tableWidth = 10;
var tableTop = 10;
var tableLeft = 10;
var numLiveCells = 0;

var tableView = []; //Array holding the View elements that make up the table.

var gameActive = false;

var gameInterval; //Variable that setInterval() assigns to.
				  //Needed to cancel the interval with clearInterval(gameInterval)


//Perform these actions if these view components are clicked.
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

//Starts the game, game advances in half second intervals
function startGame(e) {
		$.startButton.title = "Stop";
		gameActive = true;
		gameInterval = setInterval(tick, 500);
}

//Stops the game
function stopGame(e) {
	$.startButton.title = "Start";
	gameActive = false;
	clearInterval(gameInterval);
}

//Toggles a cell background to be blue (alive) or dead (white).
function toggleCell(e) {
	this.toggleBackground();
}

//Generating the table using Titanium View elements.
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
			 
			 view.addEventListener('click', toggleCell); //Add event listener for each view
			 tableView.push(view); //Store view in tableView array so we can access it later.
			 
			 $.index.add(view);
	};
};

//Set initial live cells, randomly
for (var i = 0; i < tableRows; i++) {
	for (var j = 0; j < tableCols; j++) {
		var rand = Math.random();
		if (rand < 0.50) {
			tableView[i + tableRows*j].toggleBackground();
		}
	}
}
// tableView[8 + 10*8].toggleBackground();

//Game of Life logic
function cellExistsAt(i, j) {
	return tableView[i + tableRows*j].backgroundColor == 'blue';
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
    if (i > 0 && j < tableCols - 1 && cellExistsAt(i - 1, j + 1)) {
		numNeighbors++;//top_right neighbor
    }
    if (j > 0 && cellExistsAt(i, j - 1)) {
		numNeighbors++;//left neighbor
    }
    if (j < tableCols - 1 && cellExistsAt(i, j + 1)) {
		numNeighbors++;//right neighbor
    }
    if (i < tableRows - 1 && cellExistsAt(i + 1, j)) {
		numNeighbors++;//bottom neighbor
    }
    if (i < tableRows - 1 && j > 0 && cellExistsAt(i + 1, j - 1)) {
		numNeighbors++;//bottom_left neighbor
    }
    if (i < tableRows - 1 && j < tableCols - 1 && cellExistsAt(i + 1, j + 1)) {
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

    for (i = 0; i < tableRows; i++) {
        for (j = 0; j < tableCols; j++) {
            if (cellAliveNextTickAt(i, j)) {
                survivalTable[i + tableRows*j] = 1;
            }
            else {
                survivalTable[i + tableRows*j] = 0;
            }
        }
    }

    //Use survival table to adjust game table for next time unit
    for (i = 0; i < tableRows; i++) {
        for (j = 0; j < tableCols; j++) {
            if (survivalTable[i + tableRows*j] == 1) {
            	if (!cellExistsAt(i, j)) {
                	tableView[i + tableRows*j].backgroundColor = 'blue';
                	numLiveCells++;
				}
            }
            else {
            	if (cellExistsAt(i, j)) {
                	tableView[i + tableRows*j].backgroundColor = 'white';
                	numLiveCells--;
				}
            }
        }
    }
    
    // $.label.text = "numLiveCells = " + numLiveCells;
    
}
