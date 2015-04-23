// var rows;
// var cols;

function GameOfLifeModel(rows, cols) {
	this.rows = rows;
	this.cols = cols;
	this.getNumRows = getNumRows;
	this.getNumCols = getNumCols;
}

GameOfLifeModel.prototype.getNumRows = function() {
	return this.rows;
};

// exports.GameOfLifeModel = function(rows, cols) {
	// this.rows = rows;
	// this.cols = cols;
	// this.getNumRows = getNumRows;
	// this.getNumCols = getNumCols;
// };

module.exports = GameOfLifeModel;

// function getNumRows() {
	// return this.rows;
// }
// 
// function getNumCols() {
	// return this.cols;
// }

exports.definition = {
	// config: {
		// "columns": {
			// "numRows": "Integer",
			// "numCols": "Integer"
		// }
	// },
	// extendModel: function(Model) {
		// _.extend(Model.prototype, {
// 			
		// });
// 
		// return Model;
	// },
	// extendCollection: function(Collection) {
		// _.extend(Collection.prototype, {
			// // extended functions and properties go here
		// });
// 
		// return Collection;
	// }
};