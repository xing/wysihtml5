module("wysihtml5.dom.table", {
  setup: function() {
      var row, cell;
      
      this.wrapper = document.createElement("div");
      this.wrapper.innerHTML = '<table id="my-table">\
          <tr>\
              <td></td><td></td><td></td><td></td>\
          </tr>\
          <tr>\
              <td></td><td></td><td></td><td></td>\
          </tr>\
          <tr>\
              <td></td><td></td><td></td><td></td>\
          </tr>\
          <tr>\
              <td></td><td></td><td></td><td></td>\
          </tr>\
      </table>';
      document.body.appendChild(this.wrapper);
      this.table = document.getElementById('my-table');
  },
  
  teardown: function() {
    this.wrapper.parentNode.removeChild(this.wrapper);
  },
  
  getTable: function() {
      return this.table;
  } 
});

test("getCellsBetween", function() {
    var cells = this.getTable().querySelectorAll('td'),
        cellFirst = cells[0],
        cellLast = cells[cells.length - 1],
        secondCell = cells[1],
        beforeLastCell = cells[cells.length - 2],
        secondRowFirstCell = cells[4],
        between = wysihtml5.dom.table.getCellsBetween(cellFirst, cellLast);
        
     equal(between.length, 4*4, "All 16 cells are in list of selection from first to last cell");
     equal(between[0], cellFirst, "First cell of selection in list and first");
     equal(between[between.length - 1], cellLast, "Last cell of selection in list and last");
     
     var inList1 = false;
     var inList2 = false;
     var inList3 = false;
     for (var i = 0, imax = between.length; i < imax; i++) {
         if (between[i] == secondRowFirstCell) {
             inList1 = true;
         }
         if (between[i] == cellFirst) {
             inList2 = true;
         }
         if (between[i] == cellLast) {
             inList3 = true;
         } 
     }
     ok(inList1 && inList2 && inList3, "First, last and second row first cell are in list");
     
     between = wysihtml5.dom.table.getCellsBetween(secondCell, beforeLastCell);
     equal(between.length, 2*4, "List is 8 cells long if selections is moved from second cell to before last (first and last column not selected)");
     
     var notInList = true;
     for (var j = 0, jmax = between.length; j < jmax; j++) {
         if (between[j] == secondRowFirstCell || between[j] == cellFirst || between[j] == cellLast) {
             notInList = false;
         } 
     }
     ok(notInList, "First, last and second row first cell are not in list anymore");
     
     between = wysihtml5.dom.table.getCellsBetween(secondCell, secondCell);
     equal(between.length, 1, "List collapses to one cell if start and end cell are the same");
     equal(between[0], secondCell, "The element in list is correct");
});

test("addCells (above/below)", function() {
    var cells = this.getTable().querySelectorAll('td'),
        rows = this.getTable().querySelectorAll('tr'),
        cellFirst = cells[0],
        cellLast = cells[cells.length - 1],
        startRowsNr = rows.length;
        
    wysihtml5.dom.table.addCells(cellLast,"below");
    equal(this.getTable().querySelectorAll('tr').length, startRowsNr + 1, "One row added successfully to table location below");
    
    var newrows = this.getTable().querySelectorAll('tr'),
        bottomSecondRowCells = newrows[newrows.length - 2].querySelectorAll('td'),
        lasCellOfBSrow = bottomSecondRowCells[bottomSecondRowCells.length - 1];
        
    equal(lasCellOfBSrow, cellLast, "Row added correctly below cell and original DOM object is intact");
    
    wysihtml5.dom.table.addCells(cellLast,"below");
    equal(this.getTable().querySelectorAll('tr').length, startRowsNr + 2, "One row added successfully to table location belown (last to second row)");
    equal(this.getTable().querySelectorAll('td')[15], cellLast, "Row added correctly below cell and original DOM object is intact");
    
    wysihtml5.dom.table.addCells(cellFirst,"above");
    equal(this.getTable().querySelectorAll('tr').length, startRowsNr + 3, "One row added successfully to table location above");
    equal(this.getTable().querySelectorAll('td')[4], cellFirst, "Row added correctly above cell and original DOM object is intact");
    
    wysihtml5.dom.table.addCells(cellFirst,"above");
    equal(this.getTable().querySelectorAll('tr').length, startRowsNr + 4, "One row added successfully to table location above (on second row)");
    equal(this.getTable().querySelectorAll('td')[8], cellFirst, "Row added correctly above cell and original DOM object is intact");
});

test("addCells (before/after)", function() {
    var cells = this.getTable().querySelectorAll('td'),
        nr_rows = this.getTable().querySelectorAll('tr').length,
        cellFirst = cells[0],
        cellLast = cells[cells.length - 1];
        
    wysihtml5.dom.table.addCells(cellFirst, "before");
    equal(this.getTable().querySelectorAll('td').length, cells.length +  (1 * nr_rows), "One column added successfully to table location before");
    equal(this.getTable().querySelectorAll('td')[1], cellFirst, "Row added correctly before cell and original DOM object is intact");
    
    wysihtml5.dom.table.addCells(cellFirst, "before");
    equal(this.getTable().querySelectorAll('td').length, cells.length +  (2 * nr_rows), "One column added successfully to table location before (on second column)");
    equal(this.getTable().querySelectorAll('td')[2], cellFirst, "Row added correctly before cell and original DOM object is intact");
    
    wysihtml5.dom.table.addCells(cellLast, "after");
    equal(this.getTable().querySelectorAll('td').length, cells.length +  (3 * nr_rows), "One column added successfully to table location after");
    equal(this.getTable().querySelectorAll('td')[this.getTable().querySelectorAll('td').length - 2], cellLast, "Row added correctly after cell and original DOM object is intact");
    
    wysihtml5.dom.table.addCells(cellLast, "after");
    equal(this.getTable().querySelectorAll('td').length, cells.length +  (4 * nr_rows), "One column added successfully to table location after (on last to second column)");
    equal(this.getTable().querySelectorAll('td')[this.getTable().querySelectorAll('td').length - 3], cellLast, "Row added correctly after cell and original DOM object is intact");
});



test("merge/unmerge", function() {
    var cells = this.getTable().querySelectorAll('td'),
        nr_cells = cells.length,
        txt1 = document.createTextNode('Cell'),
        txt2 = document.createTextNode('texts'),
        txt3 = document.createTextNode('merged');
    
    cells[0].appendChild(txt1);
    cells[1].appendChild(txt2);
    cells[5].appendChild(txt3);
    
    // merge
    equal(wysihtml5.dom.table.canMerge(cells[0], cells[9]), true , "canMerge returns true correctly for unmerged selection");

    wysihtml5.dom.table.mergeCellsBetween(cells[0], cells[9]);
    equal(this.getTable().querySelectorAll('td').length, nr_cells - 5, "Top left corner (6 cells) correctly merged");
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('colspan'), 2, "Colspan attribute added correctly");
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('rowspan'), 3, "Rowspan attribute added correctly");
    
    equal(this.getTable().querySelectorAll('td')[0].innerHTML.replace(/\s\s+/g, ' ').replace(/\s+$/g, ''), "Cell texts merged" , "cell texts correctly merged");
    
    var cells_m1 = this.getTable().querySelectorAll('td');

    equal(wysihtml5.dom.table.canMerge(cells_m1[0], cells_m1[1]), false , "canMerge returns false correctly for selection containing merged cells");
    
    wysihtml5.dom.table.mergeCellsBetween(cells_m1[cells_m1.length - 6], cells_m1[cells_m1.length - 1]);
    equal(this.getTable().querySelectorAll('td').length, nr_cells - 8, "Bottom right corner (4 cells) correctly merged");
    
    var cells_m2 = this.getTable().querySelectorAll('td');
    equal(cells_m2[cells_m2.length -3].getAttribute('colspan'), 2, "Colspan attribute added correctly (Bottom right corner)");
    equal(cells_m2[cells_m2.length -3].getAttribute('rowspan'), 2, "Rowspan attribute added correctly (Bottom right corner)");
    
    var nr_cells_m2 = cells_m2.length;
    
    // should not merge
    wysihtml5.dom.table.mergeCellsBetween(cells_m2[0], cells_m2[cells_m2.length - 1]);
    equal(this.getTable().querySelectorAll('td').length, nr_cells_m2, "Correctly refuses to merge allready merged cells");
    
    // unmerge
    var umerge_cell1 = cells_m2[cells_m2.length -3];
    
    equal(umerge_cell1.getAttribute('colspan'), 2, "Colspan attribute is set before unmerge (Bottom right corner)");
    equal(umerge_cell1.getAttribute('rowspan'), 2, "Rowspan attribute is set before unmerge (Bottom right corner)");
    
    wysihtml5.dom.table.unmergeCell(umerge_cell1);
    equal(this.getTable().querySelectorAll('td').length, nr_cells - 5, "Bottom right corner (4 cells) correctly unmerged");
    
    var cells_m3 = this.getTable().querySelectorAll('td');
    equal(cells_m3[cells_m3.length - 6], umerge_cell1, "Unmerged cell is intact and not removed from DOM");
    equal(umerge_cell1.getAttribute('colspan'), null, "Colspan attribute removed correctly (Bottom right corner)");
    equal(umerge_cell1.getAttribute('rowspan'), null, "Rowspan attribute removed correctly (Bottom right corner)");
    
    equal(cells_m3[0].getAttribute('colspan') , 2, "Colspan of top right corner is untouched");
    equal(cells_m3[0].getAttribute('rowspan'), 3, "Rowspan of top right corner is untouched");
    
    wysihtml5.dom.table.unmergeCell(cells_m3[0]);
    
    equal(this.getTable().querySelectorAll('td').length, nr_cells, "Top right unmerged correctly, table is back at start layout");
    
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('colspan') , null, "Colspan removed (Top Left)");
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('rowspan'), null, "Rowspan removed (Top Left)");
    
    equal(this.getTable().querySelectorAll('td')[0].innerHTML.replace(/\s\s+/g, ' ').replace(/\s+$/g, ''), "Cell texts merged" , "cell texts correctly in first cell");
});

test("removeCells", function() {
    var cells = this.getTable().querySelectorAll('td'),
        nr_rows = this.getTable().querySelectorAll('tr').length,
        nr_cols = this.getTable().querySelectorAll('tr')[0].querySelectorAll('td').length;
    
    wysihtml5.dom.table.removeCells(cells[1], "column");
    equal(this.getTable().querySelectorAll('tr')[0].querySelectorAll('td').length, nr_cols - 1, "One column removed successfully");
    equal(this.getTable().querySelectorAll('tr').length, nr_rows, "Rows untouched");
    
    wysihtml5.dom.table.removeCells(this.getTable().querySelectorAll('td')[4], "row");
    
    equal(this.getTable().querySelectorAll('tr')[0].querySelectorAll('td').length, nr_cols - 1, "Columns untouched");
    equal(this.getTable().querySelectorAll('tr').length, nr_rows -1, "One row removed successfully");
    
    var cells1 = this.getTable().querySelectorAll('td');
    
    wysihtml5.dom.table.mergeCellsBetween(cells1[0], cells1[4]);
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('rowspan'), 2, "One cell merged for testing, rowspan 2");
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('colspan'), 2, "One cell merged for testing, colspan 2");
    
    wysihtml5.dom.table.removeCells(this.getTable().querySelectorAll('tr')[1].querySelectorAll('td')[0], "row");
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('rowspan'), null, "Meged cell rowspan removed correlctly");
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('colspan'), 2, "Colspan remained correct");
    
    
    equal(this.getTable().querySelectorAll('tr')[1].querySelectorAll('td').length, nr_cols - 1, "Nr of columns correct");
    equal(this.getTable().querySelectorAll('tr').length, nr_rows -2, "Nr of rows correct");
    
    wysihtml5.dom.table.removeCells(this.getTable().querySelectorAll('td')[3], "column");
    
    equal(this.getTable().querySelectorAll('tr')[0].querySelectorAll('td').length, nr_cols - 2, "Nr of columns correct afrer merged column removed");
    
    equal(this.getTable().querySelectorAll('td')[0].getAttribute('colspan'), null, "Meged cell colspan removed correlctly");
    
    wysihtml5.dom.table.removeCells(this.getTable().querySelectorAll('td')[0], "column");
    wysihtml5.dom.table.removeCells(this.getTable().querySelectorAll('td')[0], "row");
    wysihtml5.dom.table.removeCells(this.getTable().querySelectorAll('td')[0], "column");

    equal(this.getTable().parentNode, null, "Table remove table from dom when last cell removed");
    
});

test("orderSelectionEnds", function() {
    var cells = this.getTable().querySelectorAll('td'),
        cellFirst = cells[0],
        cellLast = cells[cells.length - 1];
        
    var ends = wysihtml5.dom.table.orderSelectionEnds(cellLast, cellFirst);
    
    ok(ends.end == cellLast && ends.start == cellFirst, "Given cells ordered correctly");
});

test("indexOf/findCell", function() {
    wysihtml5.dom.table.mergeCellsBetween(this.getTable().querySelectorAll('td')[1], this.getTable().querySelectorAll('td')[6]);
    var cell = this.getTable().querySelectorAll('td')[4],
        idx = wysihtml5.dom.table.indexOf(cell);
        
    ok(idx.row == 1 && idx.col == 3, "Index gets position correctly in table with merged cell");
    
    equal(wysihtml5.dom.table.findCell(this.getTable(), idx), cell, "Cell element got correctly by index");
});

