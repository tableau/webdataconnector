/*
gscTestSheetParse();
function gscTestSheetParse()
{
    var isDate;
    var isDate1 = gscParseIsProbablyDateTimeText("1-2-2015");
    var isDate2 = gscParseIsProbablyDateTimeText("12-2-2015");
    var isDate3 = gscParseIsProbablyDateTimeText("123-2-2015");
    var isDate4 = gscParseIsProbablyDateTimeText("12-2-2015 8:00AM");
    var isDate5 = gscParseIsProbablyDateTimeText("$ 12-2-2015 8:00AM");
    var isDate6 = gscParseIsProbablyDateTimeText("hello");
    var isDate7 = gscParseIsProbablyDateTimeText("24");
    var isDate8 = gscParseIsProbablyDateTimeText("12/2/2015");
    var isDate9 = gscParseIsProbablyDateTimeText("12-2-2015");
    var isDate10 = gscParseIsProbablyDateTimeText("12-2-2015 8:00AM");
    var isDate11 = gscParseIsProbablyDateTimeText(" 12-2-2015 8:00AM");
    var isDate12 = gscParseIsProbablyDateTimeText("800.200.201");
    var isDate13 = gscParseIsProbablyDateTimeText(" 8.12.2015");

    var isCurrency;
    isCurrency = gscParseHasCurrencySymbol("52");
    isCurrency = gscParseHasCurrencySymbol("$52");
    isCurrency = gscParseHasCurrencySymbol("52$");
    isCurrency = gscParseHasCurrencySymbol("   $52");
    isCurrency = gscParseHasCurrencySymbol("   $52.00  ");
    isCurrency = gscParseHasCurrencySymbol("   €52.00  ");

    
    //var regExDate = /w;
    var spreadsheet = gscGoogleSheetParseFromCellsFeed(_gscGoogleSheetTestData.feed.entry); //
    var headersAndTypes = gscGetSpreadsheetColumnHeadersAndTypes(spreadsheet);

    var arrOut = gscSpreadsheetToNameKeyArray(spreadsheet, headersAndTypes);
    
}
*/

//Generate an array of row objects for the extract generation
function gscSpreadsheetToNameKeyArray(spreadsheet, columnInfo)
{
    localAssert(!gscIsNullOrUndefined(spreadsheet), "no spreadsheet");
    localAssert(!gscIsNullOrUndefined(columnInfo), "no column info");

    var headerNames = columnInfo.headerNames;
    var headerTypes = columnInfo.headerTypes;
    localAssert(!gscIsNullOrUndefined(headerNames), "header names missing");
    localAssert(!gscIsNullOrUndefined(headerTypes), "header types missing");

    var numColumns = headerNames.length;
    var numRows = spreadsheet.getMaxRowNumber();
    var arrOut = []; //Array

    //For every row
    for (var idxRow = 2; idxRow <= numRows; idxRow++)
    {
        var rowData = {} //Object
        //Look at all the columns
        for(var idxCol = 1; idxCol <= numColumns; idxCol++)
        {
            var colName = headerNames[idxCol - 1];
            var colType = headerTypes[idxCol - 1];
            var cellData = spreadsheet.getCell(idxRow, idxCol);

            var cellText = "";
            if(gscIsNullOrUndefined(cellData))
            {
                cellText = "";
            }
            else if(cellData.cellIsEmpty == true)
            {
                cellText = "";
            }
            else
            {
                if(colType == "string")
                {
                    cellText = cellData.cellText;
                }
                else if(colType == "float")
                {
                    cellText = gscGenerateFloatTextFromCell(cellData);
                }
                else if(colType == "date")
                {
                    try
                    {
                        cellText = gscGenerateDateTextFromNumber(cellData.cellAsNumber)
                    }
                    catch(exDate)
                    {
                        localAssert(false, "not a date: " + cellData.cellText);
                        cellText = ""; //March on with NULL
                    }
                }
                else
                {
                    localAssert(false, "unknown data type" + colType)
                }
            }

            //Now that we have the text for the column, add it
            rowData[colName] = cellText;
        }//end column loop
        arrOut.push(rowData);
    }//end row loop
    return arrOut;
}

//Try to turn a cell into floating point text
function gscGenerateFloatTextFromCell(cellData)
{
    //Normal case, the cell has a numberic value
    if (!gscIsNullOrUndefined(cellData.cellAsNumber)) {
        return cellData.cellAsNumber.toString();
    }

    //It is also possible that the cell has a string value (it was not formatted as a number) -- we should
    //still try to parse it
    try {
        var textAsFloat = parseFloat(cellData.cellText);
        return textAsFloat.toString();
    }
    catch (exTextFloatParse) {
        localAssert(false, "text field found in float column");
    }

    return "";
}

//-----------------------------------------------------------
// Takes in a numeric date and attempts to produce a number
// [cellAsNumber] Numeric date (Excel # scheme for dates)
//-----------------------------------------------------------
function gscGenerateDateTextFromNumber(cellAsNumber)
{
    var daysSince2015Jan1 = cellAsNumber - 42005;
    //var refDate = new Date(2015, 0, 0, 0, 0, 0, 0);
    var refDate = new Date("2015-01-01T00:00:00.000Z");
    var newDate = new Date(refDate.getTime() + (daysSince2015Jan1 * 24.0 * 60 * 60 * 1000));
    var dateTextOut = newDate.toISOString();
    return dateTextOut;
}

//Return the colum header names and types
function gscGetSpreadsheetColumnHeadersAndTypes(spreadsheet)
{
    localAssert(!gscIsNullOrUndefined(spreadsheet), "no spreadsheet");

    //Parse up to 500 rows
    var maxParseRow = spreadsheet.getMaxRowNumber();
    if(maxParseRow > 500)
    {
        maxParseRow = 500;
    }

    //Degenerate case
    if (maxParseRow < 2)
    {
        localAssert(!gscIsNullOrUndefined(spreadsheet), "no data rows");
        return null;
    }

    var colHeaders = gscGetSpreadsheetColumnHeaders(spreadsheet);
    //Look at each
    var colHeaderTypes = gscGetSpreadsheetColumnTypes(spreadsheet, colHeaders.length, 2, maxParseRow);

    //Pack it in an object and return it
    return { headerNames: colHeaders, headerTypes: colHeaderTypes };
}

//==============================================================================
//Looks in the columns of the spreadsheet and determines the proper data type 
//for each column, by examining the data
// [spreadsheet] spreadsheet to look in
// [numberColumns] Return results from 1 to numberColumns
// [startScanRow] Row to start looking at data types in
// [endScanRow] Row to end looking at data types in
// return: Array of (string) data type names
//==============================================================================
function gscGetSpreadsheetColumnTypes(spreadsheet, numberColumns, startScanRow, endScanRow)
{
    localAssert(!gscIsNullOrUndefined(spreadsheet), "no spreadsheet");

    var arrOut = [];
    for (var colIdx = 1; colIdx <= numberColumns; colIdx++)
    {
        var dataTypeText = gscGetSpreadsheetTypeForSingleColumn(spreadsheet, colIdx, startScanRow, endScanRow);
        arrOut.push(dataTypeText);
    }

    return arrOut;
}

// Looks in a specific column
// [spreadsheet] spreadsheet to look in
// [numberColumns] Return results from 1 to numberColumns
// [startScanRow] Row to start looking at data types in
// [endScanRow] Row to end looking at data types in
// return: (string) data type names
function gscGetSpreadsheetTypeForSingleColumn(spreadsheet, column, startScanRow, endScanRow)
{
    localAssert(!gscIsNullOrUndefined(spreadsheet), "no spreadsheet");
    var dataTypeOut = null;

    for(var rowIdx = startScanRow; rowIdx <= endScanRow; rowIdx++)
    {
        var cell = spreadsheet.getCell(rowIdx, column);
        //If the cell has no data, it has no affect on the data type
        if (!gscIsNullOrUndefined(cell))
        {
            if (!cell.cellIsEmpty) {
                //If we have no previous data type, then it can be a date
                if ((cell.cellIsProbablyDate) &&
                    ((dataTypeOut == null) || (dataTypeOut == "date"))) //We can go from null -> datetime, or stay at datetime (can't go from # -> datetime)
                {
                    dataTypeOut = "date";
                }
                else if ((cell.cellIsNumberOrDate) &&
                       ((dataTypeOut == null) || (dataTypeOut == "date") || (dataTypeOut = "float"))) //We can go from null to #, or downgrade from datetime to number
                {
                    dataTypeOut = "float";
                }
                else {
                    return "string";  //As soon as we hit a string, the column is a strong
                }
            }
        }//End if gscIsNullOrUndefined(cell)
    }//end for

    return dataTypeOut;
}

//Gets the names of all the columns in the 1st row of the spreadsheet
//[ret] Array of strings
function gscGetSpreadsheetColumnHeaders(spreadsheet)
{
    localAssert(!gscIsNullOrUndefined(spreadsheet), "no spreadsheet");

    var arrOut = [];
    var columnsInFirstRow = spreadsheet.getMaxColNumberForRow(1);
    //Get each column name
    for (var colIdx = 1; colIdx <= columnsInFirstRow; colIdx++)
    {
        var cell = spreadsheet.getCell(1, colIdx);
        var columnName = "";
        if (!gscIsNullOrUndefined(cell))
        {
            columnName = cell.cellText;
        }

        //If it's blank, assign it a name
        if(gscIsEmptyString(columnName))
        {
            "col " + colIdx.toString();
        }

        arrOut.push(columnName);
    }

    //The parsed set of column headers
    return arrOut;
}


//Applies a simple heuristic to look for common date formats
//[str] text to parse
function gscParseIsProbablyDateTimeText(str)
{
    localAssert(!gscIsNullOrUndefined(str), "null date candidate string");
    str = str.trim(); //Trim out any whitespace

    //^ <-- must be beginning of string
    //[0-9]+   <-- 1 or more digits
    //followed by... [/\-\\\.] any of these seperators  ---> / - \ . <--- are commonly used date seperators world wide
    //followed by... [0-9]+   <-- 1 or more digits
    //followed by... [/\-\\\.] any of these seperators
    //followed by... [0-9]+   <-- 1 or more digits
    //followed by... anything
    
    var regTestDate_start1or2digit = /^[0-9]{1,2}[/\-\\\.][0-9]{1,2}[/\-\\\.][0-9]+[.]*/;
    var regTestDate_start4digit = /^[0-9]{4}[/\-\\\.][0-9]{1,2}[/\-\\\.][0-9]+[.]*/;
    //var regTestDate = /^[0-9]{1,2}[/\-\\\.][0-9]+[/\-\\\.][0-9]+[.]*/;

    return (regTestDate_start1or2digit.test(str) || (regTestDate_start4digit.test(str)))
         && !gscParseHasCurrencySymbol(str);
}

//True if the string contains a currency symbol
function gscParseHasCurrencySymbol(str)
{
    var regTestDate = /[$|€|£][.]*/;
    return regTestDate.test(str);
}

//Parse the array of Google Sheet Cells
function gscGoogleSheetParseFromCellsFeed(arrCells)
{
    //Parse all the cell values
    //var arrCells = res.feed.entry;
    var arrLength = arrCells.length;
    var storeSpreadsheet = gscCellFeedManagerFactory();
    for (var idx = 0; idx < arrLength; idx++) {
         
        var storeCell = null;
        try
        {
            storeCell = gscCreateCellFromGoogleCell(arrCells[idx]);
        }
        catch(exParse)
        {
            localAssert(false, "cell parse error");
        }

        //If we had a valid parse, store the cell
        if (storeCell != null)
        {
            storeSpreadsheet.setCell(parseInt(storeCell.row), parseInt(storeCell.col), storeCell);
        }
    }

    return storeSpreadsheet;
}

//Parse a Google cell and extract the data we need
function gscCreateCellFromGoogleCell(googleCell)
{
    //Sanity check
    if (gscIsNullOrUndefined(googleCell))
    {
        localAssert(false, "null cell");
        return null;
    }

    var gs$Cell = googleCell.gs$cell;
    var gsCellCol = gs$Cell.col;
    var gsCellRow = gs$Cell.row;

    
    var isNumberOrDate = false;
    var isProbablyDate = false;
    var isEmptyCell = false;
    var googleCellText = googleCell.content.$t;

    //Blank cell is null
    if (gscIsEmptyString(googleCellText)) {
        isEmptyCell = true;
    }
    else {

        //===========================================================================
        //The gs$Cell.numericValue text is very useful - it contains a numeric value
        //that cleans up many formatting compexities in the raw user display text of 
        //the cell
        // - Percents are shown as d/100 values (removing the need to parse the % and divide)
        // - International decimal and thousands format characters are dealt with
        // - Currency is dealt with
        // - Dates are treated as #'s (so we can do date math later)
        //===========================================================================
        var cellNumericValueText = gs$Cell.numericValue;
        var cellNumericValue = null;
        if (!gscIsEmptyString(cellNumericValueText)) {
            cellNumericValue = parseFloat(cellNumericValueText);
            isNumberOrDate = true;

            if ((cellNumericValue >= 0) && (cellNumericValue <= 2958465)) //2958465 -> 12/31/9999
            {
                //If its a number, it might be a date
                //See if it matches common date formats
                if (gscParseIsProbablyDateTimeText(googleCellText)) {
                    isProbablyDate = true;
                }
            }
        }
    }

    var storeCell =
    {
        cellIsEmpty        : isEmptyCell,
        cellText           : googleCellText,
        cellAsNumber       : cellNumericValue,
        cellIsNumberOrDate : isNumberOrDate,
        cellIsProbablyDate : isProbablyDate,
        col                : gsCellCol,
        row                : gsCellRow

    }

    return storeCell;
}

//=============================================================================
//Stores an in memory representation of a sparse spreadsheet
//=============================================================================
function gscCellFeedManagerFactory() {
    var obj = {
        _rows : {}, //somewhere to store the rows
        _maxRowNumber: -1,
        _maxColNumber: -1,

        getMaxRowNumber: function () { return this._maxRowNumber;},
        getMaxColNumber: function () { return this._maxColNumber; },

        //Get the max # column in the specified row
        getMaxColNumberForRow: function (row)
        {
            localAssert(gscIsNumber(row), "missing row");
            var rowManager = this._getRowManager(row);

            //If the row has no entries, it has no column count
            if(gscIsNullOrUndefined(rowManager))
            {
                return 0;
            }
            return rowManager.getMaxColNumber();
        },

        //Stores a cell in our manager
        setCell: function (row, column, cellInfo) {
            localAssert(gscIsNumber(row), "missing row");
            localAssert(gscIsNumber(column), "missing column");
            localAssert(!gscIsNullOrUndefined(cellInfo), "missing cell info");
            var rowManager = this._getRowManager(row, true);
            rowManager.setCell(column, cellInfo);

            //Keep track of the maximum extent of the spreadsheet width/height
            if(row > this._maxRowNumber)
            {
                this._maxRowNumber = row;
            }
            if (column > this._maxColNumber)
            {
                this._maxColNumber = column;
            }
        },

        //Gets a cell if it exists
        getCell: function (row, column) {
            var rowManager = this._getRowManager(row);
            if (gscIsNullOrUndefined(rowManager)) {
                return null;
            }
            return rowManager.getCell(column);
        },

        //Gets the manager for a row
        _getRowManager: function (rowNumber, createIfNeeded) {
            var rowKey = "row:" + rowNumber.toString();
            var rowManager = this._rows[rowKey];
            if (gscIsNullOrUndefined(rowManager)) {
                if (!createIfNeeded) {
                    return null;
                }

                //Add a row manager
                rowManager = gscCellFeedManager_RowManagerFactory();
                this._rows[rowKey] = rowManager;
            }

            //Return the 
            return rowManager;
        }
    };

    return obj;
}

//Creates a row manager
function gscCellFeedManager_RowManagerFactory() {
    var obj = {
        _cols: {}, //somewhere to store the rows
        _maxColNumber: -1,

        //Get max column number
        getMaxColNumber: function () { return this._maxColNumber; },

        //Storing cells
        setCell: function (columnNumber, cellInfo) {
            var colKey = "col:" + columnNumber.toString();
            this._cols[colKey] = cellInfo;

            //Keep track of the maximum column number
            if(columnNumber > this._maxColNumber)
            {
                this._maxColNumber = columnNumber;
            }
        },

        //Getting Cells
        getCell: function (columnNumber) {
            var colKey = "col:" + columnNumber.toString();
            var cell = this._cols[colKey];

            if (gscIsNullOrUndefined(cell)) { return null; }
            return cell;
        }
    };

    return obj;
}
