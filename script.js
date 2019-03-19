function queensPuzzle() {
    var queenCounter = 0;	
	var cells;
	var boardElement = $('.board');
	var message = $('.message em');
	
	function drawBoard() {		
		var structure = '';	
		for(var i = 0 ; i < 8 ; i++ ){
			structure += '<div class="row">';
			for(var j = 0 ; j < 8 ; j++ ){
				structure += '<div class="cell ' +
				( (i + j) % 2 === 0 ? 'light': 'dark') + '" id="' + j + '_' + i + '">' +            
				'</div>';
			}
			structure += '</div>';
		}		
		boardElement.append(structure);
		cells = $('.cell');
		
		// bug fix #1: removing a queen removed highlight from multi-highlighted cells.
		cells.each(function(index) {
			var data = $(this).data();
			data.threats = 0;
		});
	}
	
	// handle add/remove queen
	function handleQueen(x, y) {				
		if(getCellElement(x, y).hasClass('queen')){	
			removeQueen(x, y);
			updatePath(x, y, unHighlight);
		}
		else {
			if(queenCounter == 8) {
				message.text('All queens are on board');
				return false;
			}
			// related to bug fix #1
			var data = getCellElement(x, y).data();
			if(data.threats == 0) {				
				addQueen(x, y);	
				updatePath(x, y, highlight);				
			}			
			else {
				message.text('The queen is dead');
				return false;
			}	
		}	
	}
	
	// Updating queen's possible paths
	function updatePath(x, y, cellUpdater) {
		// move: horizontal east
		updateDirectionForPath(x, y, cellUpdater, 0, 1);
		// move: horizontal west
		updateDirectionForPath(x, y, cellUpdater, 0, -1)
		// move: vertical south
		updateDirectionForPath(x, y, cellUpdater, 1, 0);
		// move: vertical north
		updateDirectionForPath(x, y, cellUpdater, -1, 0);
		// move: south-east
		updateDirectionForPath(x, y, cellUpdater, 1, 1);
		// move: south-west
		updateDirectionForPath(x, y, cellUpdater, 1, -1);
		// move: north-east		
		updateDirectionForPath(x, y, cellUpdater, -1, 1);
		// move: north-west	
		updateDirectionForPath(x, y, cellUpdater, -1, -1);
	}
	
	// Updating path direction
	function updateDirectionForPath(x, y, cellUpdater, xDir, yDir) {		
		// bug fix #2: the loop avoids bounderies 
		x = x + xDir;
		y = y + yDir;
		// within bounderies
		while((x < 8 && x >= 0 && y < 8 && y >= 0)) {
			cellUpdater(x, y); 
			x = x + xDir;
			y = y + yDir;
		}		
	}
	
	// Highlight path cells
	function highlight(x, y) {
		// related to bug fix #1
		var data = getCellElement(x, y).data();
		data.threats = data.threats + 1;		
		var classToAdd = data.threats > 1 ? 'multiple' : 'highlight';		
		getCellElement(x, y).addClass(classToAdd);		
	}
	
	// Unhighlight path cells
	function unHighlight(x, y) {
		// related to bug fix #1
		var data = getCellElement(x, y).data();
		if(data.threats <= 2) {
			var classToRemove = data.threats == 2 ? 'multiple' : 'highlight';
			getCellElement(x, y).removeClass(classToRemove);		
		}
		data.threats = data.threats - 1;		
	}
	
	function addQueen(x, y) {		
		getCellElement(x, y).addClass('queen');
		queenCounter++;
		message.text(8 - queenCounter + ' queens left');
	}
	
	function removeQueen(x, y) {		
		getCellElement(x, y).removeClass('queen');
		queenCounter--;
		message.text(8 - queenCounter + ' queens left');
	}
	
	function getCellElement(x, y) {
		return $('#' + x + '_' + y);
	}
	
    function clear() {
		cells.removeClass('highlight multiple queen');			
		// related to bug fix #1
		cells.each(function() {
			var data = $(this).data();
			data.threats = 0;
		});
		queenCounter = 0;
		message.text('');
	}	
	
	// *************************************** //
	// Eight Queen Puzzle backtracking solution:
	// Queen coordinates will be at (x == index, y == queensCells[index])
	var queensCells = [1, 1, 1, 1, 1, 1, 1, 1];
	var xAxisWithQueens = 0; 

	// Check threats for each queen
	function isValidPosition(x1, y1, x2, y2) {
		// x
		if(x1 == x2) {
			return 1;
		}
		// y
		if(y1 == y2) { 
			return 1;
		}
		// diagonal west
		if(x1 - y1 == x2 - y2) {
			return 1;
		}
		// diagonal east
		if(x1 + y1 == x2 + y2) {
			return 1;
		}
		return 0;
	}

	function solvePuzzle(queensCells, xAxisWithQueens) {			 
		// Terminating condition
		if(xAxisWithQueens == 8) {
			for(var k = 0; k < queensCells.length; k++) {
				addQueen(k, queensCells[k]);				
			}
			return true;
		}
		// For each cell count the number of threats over it
		// if threats > 0, skip this cell
		// otherwise, set coordinates in queensCells.
		for(var yAxis = 0; yAxis < 8; yAxis++) {			
			var threats = 0;
			for(var xAxis = 0; xAxis < xAxisWithQueens; xAxis++) {
			   threats += isValidPosition(xAxisWithQueens, yAxis, xAxis, queensCells[xAxis]);
			}
			if(threats > 0) {
				continue;
			}
			queensCells[xAxisWithQueens] = yAxis;
			if(solvePuzzle(queensCells, xAxisWithQueens + 1)) {	  
				return true;
			}
			else {
				queensCells[xAxisWithQueens] = -1;
			}
		}
		return false;
	}
	// *************************************** //
	
    this.bind = function() {
        drawBoard();
		$('#js_clear').on('click', clear);
		$('#js_solution').on('click', function(){			
			clear();			
			solvePuzzle(queensCells, xAxisWithQueens)
		});
		
		boardElement.on('click', '.cell', function(){
			var boardPosition = $(this).attr('id').split('_');	
			var x = parseInt(boardPosition[0]);
			var y =	parseInt(boardPosition[1]);
			handleQueen(x, y);
		});
    }
    return this;
}

$(document).ready(function() {
	new queensPuzzle().bind();
});



