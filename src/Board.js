// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },
      //test to see git push
    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var result = false;
      var row = this.get(rowIndex);
      var count = 0;
      _.each(row, function(value) {
        if(value) {
          count++;
        }
        if(count >= 2) {
          return result = true;
        }
      });
      return result;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var result = false;
      var context = this;
      var checkRows = function(index) {
        var rowCheck = context.get(index);
        if(rowCheck) {
          result = context.hasRowConflictAt(index);
          if(!result) {
            checkRows(index + 1);
          }
        }
      }
        
      checkRows(0);
      return result;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var allRows = this.rows();
      var resultsArr = [];
      _.each(allRows, function(value) {
        resultsArr.push(value[colIndex]);
      });
      var result = false;
      var count = 0;
      _.each(resultsArr, function(value) {
        if(value) {
          count++;
        }
        if(count >= 2) {
          return result = true;
        }
      });
      return result;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var result = false;
      var rowCount = this.rows();
      for(var i = 0; i < rowCount.length; i++) {
        if (result = this.hasColConflictAt(i)) {
          return result;
        }
      }
      return result;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var counter = majorDiagonalColumnIndexAtFirstRow;
      var result = false;
      var allRows = this.rows();
      var conflictsCounter = 0;
      
      
      _.each(allRows, function(value) {
        if(value[counter]) {
          conflictsCounter++;
        } 
        counter ++;
        
        if(conflictsCounter > 1) {
          return result = true
        } 
      });      
      
      return result;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function(n) {
      var rowCount = this.rows();
      var n = rowCount.length;
      var result = false;
      
      for(var i = -n + 2; i < n-1; i++) {
        //this._isInBounds(0, i){
          //result = hasAnyMajorDiagonalConflicts(rowCount[0][i+1])
       // }
        result = this.hasMajorDiagonalConflictAt(i);
        if(result) {
          break;
        }    
      }
      return result; 
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var counter = minorDiagonalColumnIndexAtFirstRow;
      var result = false;
      var allRows = this.rows();
      var conflictsCounter = 0;

      _.each(allRows, function(value) {
        if(value[counter]) {
          conflictsCounter++;
        }
        counter--;
        if(conflictsCounter > 1) {
          return result = true;
        }
      });
      
      return result;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function(n) {
      var rowCount = this.rows();
      var n = rowCount.length;
      var result = false;

      for(var i = n - 2 + n; i > 0; i--) {
        result = this.hasMinorDiagonalConflictAt(i);
        if(result) {
          break;
        }
      }

      return result;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
