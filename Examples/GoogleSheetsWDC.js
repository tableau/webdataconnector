$(document).ready(
    function () {
        gscPageBootstrap();
    });

//Client ID registered with Google. Each application needs its own (replace this with yours)
//OAuth tokens returned from Google are only valid in the context of this app-id, which includes
//the redirect url
function gscGetOAuthAppId()
{
    var clientID = "757476412337-rrlumgt3bemqnqt2qffmi45kp5qh0fiq.apps.googleusercontent.com";
    return clientID; 
}

//Expected redirect url for OAuth connections, this value is where the local HTTP server should be hosted at
//for the OAuth redirect, otherwise the OAuth connection will fail. To change this value please create your
//own OAuth App ID that uses a different base URL to host the connector.
var EXPECTED_REDIRECT_URL = "http://localhost:8888/GoogleSheetsConnector.html";

var MIN_SECONDS_REMAINING_FOR_ACCESS_TOKEN = 60;

//Global cache for the last spredsheet data we returned
//This object is used to store the processed Google Spreadsheet data in-between the two tableau wdc calls 
//during extract creation
// 1. The wdc "get column header info" call gets the full spreadsheet from Google (async) and fills out this object 
//    with header-column data type info, and all the spreadsheet cells values
// 2. The wdc "get data" call looks for this object, and if there pulls the processed Google Sheet data from it
var _gscCacheGoogleSheet = null;

//===========================================================================
//State we want the application to hold
//===========================================================================
_gscAppState = gscClassFactoryAppState();
function gscClassFactoryAppState()
{
    var obj = {
        _oAuthToken: "", //Start off with no oAuth token
        _dataParseMode: "jsonCells",

        //=========================================================================================
        //Parse mode (we are testing 2 different parsing mechanisms)
        //=========================================================================================
        getParseMode: function()
        {
            return this._dataParseMode;
        },

        setParseMode: function (parseMode)
        {
            var htmlForUi = "unknown";
            this._dataParseMode = parseMode || "jsonCells"; //Store it

            //Update the app UI
            if (parseMode == "jsonCells") {
                htmlForUi = gscGetHtmlTemplate("gscTemplate_ParseModeJsonCells")
            }
            else
            {
                localAssert(false, "unknown parse mode");
            }
            //Update the UI
            $("#gscArea_DataParseMode").html(htmlForUi);
        },

        //=========================================================================================
        //OAuth state
        //=========================================================================================
        //oAuth getter
        getOAuthToken: function (){
            var token = this._oAuthToken;
            if (gscIsEmptyString(token))
            {
                return "";
            }
            return token;
        },

        //oAuth setter
        setOAuthToken:  function (token) {
            if (gscIsEmptyString(token)) {
                this._oAuthToken = "";
            }
            this._oAuthToken = token;
        },

        //=========================================================================================
        //Workbook URL
        //=========================================================================================
        //The URL for the Google Workbook that hte user is working with
        getGoogleWorkbookUrl:  function () {
            return $('#gscTabGoogleWorkbookUrl').val();
        },

        setGoogleWorkbookUrl: function (url) {
            if (gscIsEmptyString(url))
            {
                url = "";
            }
            return $('#gscTabGoogleWorkbookUrl').val(url);
        }
    };
    return obj;
}

//===========================================================================
//===========================================================================
//TABLEAU WEB DATA CONNECTOR SPECIFIC
//===========================================================================
//===========================================================================
//TRUE: We are running inside Tableau as a Web Data Connector
//FALSE: We are running as a generic web page
function gscWdcLibraryExists()
{
    return (typeof tableau != "undefined");
}

//Called by page bootstrap code
function gscInitializeWdc()
{
    if (gscWdcLibraryExists()) {
        var myConnector = tableau.makeConnector();

        //Called by Tableau when they are loading the web data connector
        myConnector.init             = gscBindMe_wdcInit;
        myConnector.getColumnHeaders = gscBindMe_wdcGetColumnHeaders;
        myConnector.getTableData     = gscBindMe_wdcGetTableData;

        //Tell the WDC about this connector
        tableau.registerConnector(myConnector);
    }
}

//Gets bound to the myConnector object (have seperated out to allow for easy test/debugging)
function gscBindMe_wdcInit()
{
    try
    {
        gscBindMe_wdcInit_inner();
    }
    catch(ex)
    {
        localAssert(false, "Error running init");
    }
}

//Called by the web data connect initialization
function gscBindMe_wdcInit_inner()
{
    // Only require authentication if there is an OAuth token required or available, otherwise
    // public spreadsheets will fail.
    if (_gscAppState.getOAuthToken())
    {
        tableau.alwaysShowAuthUI = true;
    }
    // If we are in the interactive phase, repopulate the input text box if there is connectionData present. 
    // This is hit when editing a connection in Tableau.
    if (tableau.phase == tableau.phaseEnum.interactivePhase)
    {
        var connectionData = tableau.connectionData;
        if (!gscIsEmptyString(connectionData))
        {
            var connectObj = gscParseJsonFromPersistedConnectString();
            localAssert(!gscIsNullOrUndefined(connectObj), "no json obj");
            var workbookUrl = connectObj.googleWorkbookUrl;
            if (gscIsEmptyString(workbookUrl))
            {
                workbookUrl = "missing url...";
            }

            //If Tableau has a specific URL in mind, then use it.
            //Otherwise, if the workbookUrl tableau suggests is blank, then do nothing.  
            //-- The UI may already have data the user has entered, or has been returned from an OAuth redirect. 
            //In these cases we do not want to overwrite
            if (!gscIsEmptyString(workbookUrl)) {
                gscAttemptUiUpdateWithGoogleSheetUrl(workbookUrl);
            }
        }
        else
        {
            //Otherwise, if the workbookUrl tableau suggests is blank, then do nothing
            //gscAttemptUiUpdateWithGoogleSheetUrl("");
        }
    }
    else if (tableau.phase === tableau.phaseEnum.authPhase) {
        // in this phase we just need to make sure we have a good oAuth access key.

        gscCheckAuthCredentialsValid(function() {
            tableau.initCallback();
            tableau.submit();
        });
        return;
    }
    else
    {
        //headless mode
    }
    tableau.initCallback();
}

function gscCheckAuthCredentialsValid(finishedWithAuthCallback) {
    if (!tableau || !tableau.password) {
        // no need to check if the oAuth token is good, we don't have a token. Just get
        // a new access token.
        gscGetNewAccessToken();
        return;
    }
    var baseAuthTokenValidatorUrl = 'https://www.googleapis.com/oauth2/v1/tokeninfo';
    var connectUrl = gscAppendGoogleOAuthTokenToUrl(connectUrl, tableau.password);
    $.ajax({
        url: connectionUrl,
        dataType: 'json',
        error: gscAjaxError,
        success: function(response) {
            var secondsRemaining = response.expires_in;
            // see if the token is still good, and if so if there is enough time left on it
            if (secondsRemaining && secondsRemaining > MIN_SECONDS_REMAINING_FOR_ACCESS_TOKEN) {
                // if the token is still useable, we are done.
                finishedWithAuthCallback();
            } else {
                gscGetNewAccessToken(); 
            }
        },
        error: gscGetNewAccessToken
    });
}

// Direct the user to get a fresh access token... then submit
function gscGetNewAccessToken() {
    // replace the normal HTML with a template that just asks the user to get a new access token.
    $("#gscMainContentArea").html(gscGetHtmlTemplate('gscTemplate_GetNewAccessToken'));
}

//Gets bound to the myConnector object (have seperated out to allow for easy test/debugging)
function gscBindMe_wdcGetColumnHeaders()
{
    var connectionData = gscParseJsonFromPersistedConnectString(); //Parse the Connection from JSON that the tableau datasource contains

    //===========================================================================
    //Determine which method of data parsing we are using
    //===========================================================================
    var parseMode = connectionData.processUsing;
    localAssert(!gscIsNullOrUndefined(parseMode), "Null parse mode");
    var connectionUrl = "";
    if (parseMode == "jsonCells") {
        connectionUrl = gscGetGoogleSheetUrlFromPersistedState_JsonCellsFeed();
        gscGetColumnHeaders_inner_cellsFeed(connectionUrl, true);
    }
    else
    {
        localAssert(false, "Unknown parse mode: " + parseMode);
    }
}

//Gets bound to the myConnector object (have seperated out to allow for easy test/debugging)
function gscBindMe_wdcGetTableData(lastRecordToken) {

    var connectionData = gscParseJsonFromPersistedConnectString(); //Parse the Connection from JSON that the tableau datasource contains

    //===========================================================================
    //Determine which method of data parsing we are using
    //===========================================================================
    var parseMode = connectionData.processUsing;
    localAssert(!gscIsNullOrUndefined(parseMode), "Null parse mode");
    var connectionUrl = "";
    if (parseMode == "jsonCells") {
        connectionUrl = gscGetGoogleSheetUrlFromPersistedState_JsonCellsFeed();
        gscGetTableData_inner_cellsFeed(connectionUrl);

    }
    else {
        localAssert(false, "Unknown parse mode: " + parseMode);
    }
}

//Tests getting back the cells content of a sheet (as JSON) and parsing the headers
//[connectionUrl] : Url to get the data from 
function gscTestCellsParseGoogleSheetHeaders_Click(connectionUrl) {
    //Get the connection information
    gscGetColumnHeaders_inner_cellsFeed(connectionUrl, false);
}

//Show a template in the status text window
//[template] html template to show
function gscAttemptStatusTextDisplay(template)
{
    try
    {
        $("#gscArea_TopInfo").html(gscGetHtmlTemplate(template));
    }
    catch(ex)
    {
        localAssert(false, "error showing status template");
    }
}
//Show a template in the status text window
//[text] test to show
function gscAttemptStatusTextDisplay_SimpleText(text) {
    if(gscIsEmptyString(text))
    {
        text = "";
    }
    gscAttemptStatusTextDisplay_SimpleHtml(gscHtmlEncode(text));
}

//Show a template in the status text window
//[text] test to show
function gscAttemptStatusTextDisplay_SimpleHtml(text) {
    try {
        var showText = gscGetHtmlTemplate("gscTemplate_GenericStatusText");
        showText = gscReplaceAll(showText, "{{gscStatusText}}", text)
        $("#gscArea_TopInfo").html(showText);
    }
    catch (ex) {
        localAssert(false, "error showing status template");
    }
}

//Called to request our column headers data
//[connectionUrl] : url to call to ge the data
//[sendColumnsToTableau] : if true, then at the end of processing we want to send the data to tableau
function gscGetColumnHeaders_inner_cellsFeed(connectionUrl, sendColumnsToTableau)
{
    localAssert(!gscIsEmptyString(connectionUrl), "Empty url for col headers call");

    //Show status text
    gscAttemptStatusTextDisplay('gscTemplate_LoadingWorkbookData');

    //We will pass this context object into the ajax request - this will allow us to know what the URL was we were requesting, so we can avoid
    //repeat requests for the same object
    var contextObj =
        {
            requestUrl            : connectionUrl,
            sendColumnsToTableau  : sendColumnsToTableau
        }

    $.ajax({
        url: connectionUrl,
        dataType: 'json',
        error: gscAjaxError,
        success: gscAjaxResponse_GoogleCellsFeed,
        context: contextObj
    });
}

//Callback function for the AJAX request for the Google cells feed
function gscAjaxResponse_GoogleCellsFeed(res, status, xhr)
{
    //Look up what the request was
    //We'll want to push this data into a response cache
    var contextObj = this;
    var requestUrl = contextObj.requestUrl;
    localAssert(!gscIsEmptyString(requestUrl), "No request URL passed in?");

    //Status UI
    gscAttemptStatusTextDisplay('gscTemplate_ParsingSheetHeaderTypes');

    //Check the results
    localAssert(!gscIsNullOrUndefined(res), "json result set came back null - request clipped? out of memory issues?");

    //Parse the spreadsheet data
    gscAttemptStatusTextDisplay_SimpleText("parsing sheet...");
    var spreadsheet = gscGoogleSheetParseFromCellsFeed(res.feed.entry);

    //Figure out the types for the column headers
    gscAttemptStatusTextDisplay_SimpleText("processing column headers...");
    var columnInfo = gscGetSpreadsheetColumnHeadersAndTypes(spreadsheet);
    if (gscIsNullOrUndefined(columnInfo))
    {
        localAssert(false, "not enough data in rows 1 and 2 to create column information");
        return;
    }

    //Might as well generate the extract rows now
    var arrRowObjects = null;
    gscAttemptStatusTextDisplay_SimpleText("generating rows for extract...");
    try
    {
        arrRowObjects = gscSpreadsheetToNameKeyArray(spreadsheet, columnInfo);
    }
    catch (exGenerateRows) {
        localAssert(false, "spreadsheet transform error");
        gscAttemptStatusTextDisplay_SimpleText("error generating rows for extract: " + exGenerateRows.toString());
        return; //give up...
    }
    localAssert(!gscIsNullOrUndefined(arrRowObjects), "null array set");

    //Store the values in a global cache, so the next tableau request can get it
    _gscCacheGoogleSheet =
    {
        requestUrl                 : requestUrl,
        spreadsheetData            : spreadsheet,
        spreadsheetColumnInfo      : columnInfo,
        arrRowObjects              : arrRowObjects,
    }

    //Status UI
    gscAttemptStatusTextDisplay_SimpleHtml("Success processing sheet.<br />" + arrRowObjects.length.toString() + " rows");

    //If this is not a test of the connection, then send the data to tableau
    if (contextObj.sendColumnsToTableau == true) {
        //Send the results to tableau (Only used in headless mode)
        tableau.headersCallback(columnInfo.headerNames, columnInfo.headerTypes);
    }
}

//Called to send the row data to Tableau for extract generation
//[connectionUrl] : url for the data requested (we use this to look up the value in the cache
function gscGetTableData_inner_cellsFeed(connectionUrl) {
    localAssert(!gscIsEmptyString(connectionUrl), "no conneciton string");
    var cache = _gscCacheGoogleSheet;
    if (gscIsNullOrUndefined(_gscCacheGoogleSheet)) {
        localAssert(false, "no cache object");
        return; //abort
    }

    if (cache.requestUrl != connectionUrl) {
        localAssert(false, "cache object does not match");
        return; //abort
    }

    var arrRowObjects = cache.arrRowObjects;
    localAssert(!gscIsNullOrUndefined(arrRowObjects), "no row objects");
    gscAttemptStatusTextDisplay('gscTemplate_ParseWorkbookContentsDone');

    tableau.dataCallback(arrRowObjects, null, false); //Send it to Tableau and say we are done
}



//Parse the connect string into JSON
//Used to return connection information from the persisted Data Connection
function gscParseJsonFromPersistedConnectString()
{
    localAssert(!gscIsNullOrUndefined(tableau), "20150619-0957, no tableau");
    var connectJsonText = tableau.connectionData;
    localAssert(!gscIsEmptyString(connectJsonText), "no connect text");
    
    var parsedJson = null;
    try
    {
        parsedJson = eval("(" + connectJsonText + ")");
    }
    catch(ex)
    {
        localAssert(false, "error parsin json in connect obj");
    }

    return parsedJson;
}

//Returns the authenticated Google sheets URL
//This is built from the persisted data in the tableau connection and password objects
function gscGetGoogleSheetUrlFromPersistedState_JsonCellsFeed() {
    localAssert(!gscIsNullOrUndefined(tableau), "no tableau");

    //Get the connect URL
    var connectionData = gscParseJsonFromPersistedConnectString(); //Parse the Connection as JSON
    var connectUrl = connectionData.googlesheetCellsFeedUrl;
    localAssert(!gscIsEmptyString(connectUrl), "no google sheet URL");

    connectUrl = gscAppendGoogleOAuthTokenToUrl(connectUrl, tableau.password)

    return connectUrl;
}

//If an OAuth Token exists, append it to the url
//[url] URL to append to
//[oAuthToken] (optional) oAuth token
function gscAppendGoogleOAuthTokenToUrl(url, oAuthToken)
{
    //No token? - Nothing to append
    if(gscIsEmptyString(oAuthToken))
    {
        return url;
    }

    oAuthToken = oAuthToken.trim();

    //If we have an access token, append it to the access URL
    if (oAuthToken != "") {
        url = gscAppendQueryString(url, "access_token=" + oAuthToken);
    }
    return url;
}

//Creates a persistable JSON stream
//[urlCellsFeed] URL to get to the Cells Feed (JSON format)
function gscCreateJsonForConnectString(urlCellsFeed)
{
    localAssert(!gscIsEmptyString(urlCellsFeed), "no cells feed url");

    //Build a persisted JSON object
    var jsonTemplate = "{" +
                       "   googlesheetCellsFeedUrl   : '{{gscSheetCellsFeedUrl}}' " + //Programatic URL to get cells feed
                       " , googleWorkbookUrl         : '{{gscWorkbookUrl}}'       " + //user URL to load workbook in Google Sheets
                       " , processUsing              : '{{gscParseMode}}'         " + //instructions on how to parse
                       "}";
    var jsonOut = jsonTemplate;
    var jsonOut = gscReplaceAll(jsonOut, "{{gscSheetCellsFeedUrl}}", urlCellsFeed);
    var jsonOut = gscReplaceAll(jsonOut, "{{gscWorkbookUrl}}", _gscAppState.getGoogleWorkbookUrl());
    var jsonOut = gscReplaceAll(jsonOut, "{{gscParseMode}}", _gscAppState.getParseMode());

    return jsonOut;
}

//Hands off the Data Connection to Tableau to persist
//[urlJsonCellsFeedForsheetNoAuth] : url for the Cells Feed
//[oAuthAccessToken] : oAuth access token
function gscSubmitWdcForGoogleSheet_Click(
    urlJsonCellsFeedForsheetNoAuth,
    oAuthAccessToken,
    title) {
    localAssert(!gscIsNullOrUndefined(tableau), "missing tableau object")
    localAssert(!gscIsEmptyString(title), "missing title")
    if (!gscIsEmptyString(oAuthAccessToken)) {
        tableau.password = oAuthAccessToken; //Not persisted to Workbook
    }

    tableau.connectionData = gscCreateJsonForConnectString(urlJsonCellsFeedForsheetNoAuth); //Persisted to workbook
    tableau.connectionName = "Google sheet: " + title;
    tableau.submit();
}

//===========================================================================
//===========================================================================
//WEB PAGE UI MANAGEMENT
//===========================================================================
//===========================================================================
//Called when the page is loaded
function gscPageBootstrap()
{
    //Test the window location is correct for the OAuth redirect
    var currentRedirectURL = window.location.origin + window.location.pathname;
    var errorMsg = "GoogleSheetsConector is not hosted in the correct location, should be at: " + EXPECTED_REDIRECT_URL + ", actual location: " + currentRedirectURL;
    if (currentRedirectURL != EXPECTED_REDIRECT_URL)
    {
        $("#gscMainContentArea").replaceWith('<div style="margin-left:215px; margin-right:15px; min-height: 100px; font-weight: bold;">' + errorMsg + '</div>');
    }

    //Set a default parsing mode
    _gscAppState.setParseMode("jsonCells");

    //
    var returnedHash = window.location.hash;

    //If we are getting a callback from Google with the access token, then store it.
    var accessToken = getUrlHashParameter("access_token", returnedHash);
    if(!gscIsEmptyString(accessToken))
    {
        _gscAppState.setOAuthToken(accessToken);
        $("#gscTabRequestAuth").html("Authorized!");

        window.location.hash = ""; //Clear out the hash values because we don't want this state value (and access code) sitting around
    }

    //Set up the Web Data Connector
    gscInitializeWdc();

    //Get back our roundtripped state
    var stateRoundtripped = "#" + decodeURIComponent(getUrlHashParameter("state", returnedHash));
    var suggestedCommand = getUrlHashParameter("command", stateRoundtripped);
    var googleSheetUrl = getUrlHashParameter("googleSheetUrl", stateRoundtripped);
    if (!gscIsEmptyString(googleSheetUrl))
    {
        _gscAppState.setGoogleWorkbookUrl(googleSheetUrl);
    }

    //See what the suggested command was
    if(suggestedCommand == "connectToWorkbook")
    {        
        gscConnectToGoogleWorkbook_Click();
    }
    else if (suggestedCommand == "listSheets")
    {
        gscGetGoogleSheetsList();
    }
    else if (suggestedCommand == "authOnly")
    {
        //console.log(_gscAppState.getOAuthToken());
        tableau.password = _gscAppState.getOAuthToken();
        tableau.initCallback();
        tableau.submit();
    }
}

//Request the users set of owned sheets
function gscGetGoogleSheetsList()
{
    var htmlTemplate = gscGetHtmlTemplate("gscTemplate_AllWorkbooksInfo");
    htmlTemplate = gscReplaceAll(htmlTemplate, "{{gscWorkbooks}}", "requesting list of Google workbooks...");
    $("#gscArea_ListOfSpreadsheets").html(htmlTemplate);

    var oAuthAccessToken = _gscAppState.getOAuthToken();
    localAssert(!gscIsEmptyString(oAuthAccessToken), "missing oauth token")
    accessTokenQueryParam = "access_token=" + oAuthAccessToken;

    var urlRequest = "https://spreadsheets.google.com/feeds/spreadsheets/private/full?alt=json"
    urlRequest = gscAppendQueryString(urlRequest, accessTokenQueryParam)

    //Request the Workbooks list from Google
    $.ajax({
        url: urlRequest,
        dataType: 'json',
        error: gscAjaxError,
        success: gscAjaxResponse_GoogleWorkbooksList,
    });

    gscAttemptStatusTextDisplay_SimpleText("Requesting workbooks list...");
}

//Called as the ajax response to requesting the workbooks list
function gscAjaxResponse_GoogleWorkbooksList(res, status, xhr)
{
    localAssert(!gscIsNullOrUndefined(res), "blank server results")
    localAssert(!gscIsNullOrUndefined(res.feed), "blank server feed")

    var entryArr = res.feed.entry;
    localAssert(!gscIsNullOrUndefined(entryArr), "blank server feed.entry")
    var arrLen = entryArr.length;
    var arrRenderedItems = [];
    for (var arrIdx = 0; arrIdx < arrLen; arrIdx++)
    {
        var entryItem = entryArr[arrIdx];

        //Render the item into HTML and push is into an array
        var entryItemRendering = gscGenerateUiRenderingFromSpreadsheetInfo(entryItem);
        arrRenderedItems.push(entryItemRendering);
    }
    //Sort the array of objects by title
    arrRenderedItems.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()); })
    //Add all the sorted html items to the output
    var arrRenderedItemsLength = arrRenderedItems.length;
    var sheetsHtml = "";
    for (var idxRendered = 0; idxRendered < arrRenderedItemsLength; idxRendered++)
    {
        sheetsHtml = sheetsHtml + arrRenderedItems[idxRendered].html;
    }

    //Fill out the template
    var htmlTemplate = gscGetHtmlTemplate("gscTemplate_AllWorkbooksInfo");
    htmlTemplate = gscReplaceAll(htmlTemplate, "{{gscWorkbooks}}", sheetsHtml);
    
    //Update the ui
    $("#gscArea_ListOfSpreadsheets").html(htmlTemplate);
    gscAttemptStatusTextDisplay_SimpleText("Choose workbook from list");
}

//Generate a HTML rendering object for a Workbook in the workbooks list
//[entryItem] Workbook data returned from Google
function gscGenerateUiRenderingFromSpreadsheetInfo(entryItem)
{
    if (gscIsNullOrUndefined(entryItem))
    {
        localAssert(false, "blank entry")
        return "";
    }

    var title = entryItem.title.$t;
    var arrLinks = entryItem.link;
    var urlToWorkbook = gscSearchLinksForHrefProperty(arrLinks, "https://docs.google.com/spreadsheets/d/");
    if (gscIsEmptyString(urlToWorkbook))
    {
        //These seem to be used for some kinds of shared workbooks not owned by the user
        urlToWorkbook = gscSearchLinksForHrefProperty(arrLinks, "https://spreadsheets.google.com/ccc?key=");
    }
    //Consider: There are some Workbooks (external content shared with us) that we will need to parse 
    //another type of URL for.  For now we will label these as "(external)".  We could add additional
    //parsing support to get alternate URLs for this content
    if (gscIsEmptyString(urlToWorkbook))
    {
        title = "(undone)" + title;
    }

    //Fill out the template with the values
    var htmlTemplate = gscGetHtmlTemplate("gscTemplate_WorkbookInfo");
    htmlTemplate = gscReplaceAll(htmlTemplate, "{{gscTitle}}", gscHtmlEncode(title));
    htmlTemplate = gscReplaceAll(htmlTemplate, "{{gscWorkbookEditUrl}}", urlToWorkbook);

    //Return an object with html and title
    return { html : htmlTemplate , title : title}
}

//Looks for the Edit Workbook link in the Google list of links
//[arrLinks] : Google returned list of links
function gscGetGoogleWorkbookUrlFromLinks(arrLinks)
{
    return gscSearchLinksForHrefProperty(arrLinks, "https://docs.google.com/spreadsheets/d/");
}

//Searches the array for an hRef that has a specific prefix
//[arrLinks] Array to serach hRef properties of
//[searchForPrefix] Search prefix we are looking for
function gscSearchLinksForHrefProperty(arrLinks, searchForPrefix)
{
    localAssert(!gscIsNullOrUndefined(arrLinks), "blank entry");
    localAssert(!gscIsEmptyString(searchForPrefix), "blank search");

    var searchFor = searchForPrefix.toLowerCase();

    var arrLength = arrLinks.length;
    for (var idx = 0; idx < arrLength; idx++) {
        var linkObj = arrLinks[idx];
        localAssert(!gscIsNullOrUndefined(linkObj), "blank link");
        var hRef = linkObj.href;
        localAssert(!gscIsNullOrUndefined(hRef), "blank link");
        hRef = hRef.toString(); //make sure its a string
        //Look for the link in this format
        if (hRef.toLowerCase().indexOf(searchFor) == 0) {
            return hRef;
        }
    }

    return "";
}

//Called when the user selects a Google Spreadsheet
//[urlToWorkbook] : Google spreadsheet URL
function gscSelectFromWorkbooksList_Click(urlToWorkbook)
{
    _gscAppState.setGoogleWorkbookUrl(urlToWorkbook); //store the selected url
    //If the URL is not blank, then try to connect to that datasource
    if (!gscIsEmptyString(urlToWorkbook))
    {
        gscConnectToGoogleWorkbook_Click(); //Get the sheets assocated with the workbook url
    }
}

//Called to request Google authorization for our web application.
//If successful, Google will call us back, and include the necessary access token
//[callbackcommand] (optional) a contextual callback command
function gscAuthorizeWithGoogle_Click(callbackcommand)
{
    //By default, the command is connect to workbook
    if (gscIsEmptyString(callbackcommand))
    {
        callbackcommand = "connectToWorkbook";
    }

    var clientId = gscGetOAuthAppId();
    var callbackUrl = encodeURIComponent(gscUrlTrimQueryAndHash(window.location.href)); //NOTE: This callback URL must be registered with Google's Dev Console
    var accessScope = "https%3A%2F%2Fspreadsheets.google.com%2Ffeeds%2F"; //What kind of access do we want

    //State we roundtrip to google and back to let us pickup where we left off
    var stateParameters = "";
    stateParameters = gscAppendParameter(stateParameters, "command=" + callbackcommand); //What we want to do when we return
    //If we have a sheet, lets remember it by putting it into the round trip state
    var sheetUrl = _gscAppState.getGoogleWorkbookUrl();
    if (!gscIsEmptyString(sheetUrl))
    {
        stateParameters = gscAppendParameter(stateParameters, "googleSheetUrl=" + _gscAppState.getGoogleWorkbookUrl()); //What we want to do when we return
    }
    var oAuthRequestTemplate = "https://accounts.google.com/o/oauth2/auth?response_type=token&client_id={{gscClientId}}&redirect_uri={{gscRedirectBack}}&scope={{gscScope}}&state={{gscState}}";
    //Template replacement
    var navTo = oAuthRequestTemplate;
    navTo = gscReplaceAll(navTo, "{{gscClientId}}"    , clientId);
    navTo = gscReplaceAll(navTo, "{{gscRedirectBack}}", callbackUrl);
    navTo = gscReplaceAll(navTo, "{{gscScope}}", accessScope);
    navTo = gscReplaceAll(navTo, "{{gscState}}", encodeURIComponent(stateParameters));

    //window.navigate(navTo);
    window.location.href = navTo;
}

//Called to start an ajax request for the workbook's feed information
function gscConnectToGoogleWorkbook_Click() {
    //Clear out old results...
    gscSetHtmlForResultsArea(gscGetHtmlTemplate('gscTemplate_SheetsNotYetLoaded'));

    //Show header info
    $("#gscArea_TopInfo").html(gscGetHtmlTemplate('gscTemplate_ConnectingToWorkbook'));

    var urlWb = _gscAppState.getGoogleWorkbookUrl();
    if (gscIsEmptyString(urlWb))
    {
        localAssert("Please enter spreadsheet URL");
        gscSetHtmlForResultsArea("");
        return;
    }

    var workbookId = gscGetGoogleWorkbookIdFromUrl(urlWb);

    //If we have an OAuth access token control specified, use it. (may be blank)
    var oAuthAccessToken = _gscAppState.getOAuthToken();

    //
    var urlRestApi = gscGenerateUrl_GoogleWorkbookFeed(workbookId, oAuthAccessToken);
    $('#gscTabGoogleApiUrl').html(urlRestApi); //show it in the UI

    //localAssert(!gscIsEmptyString(jqConnectUrl), "no url?");
    //var urlWb = $(jqConnectUrl).val();

    $.ajax({
        url: urlRestApi,
        dataType: 'json',
        success: gscAjaxReturnSpreadsheetData,
        error: gscAjaxErrorGoogleSheetConnect
    });
}

//======================================================================
//Called when there is an error connecting to the spreadsheet
//======================================================================
function gscAjaxErrorGoogleSheetConnect(jqXHR, status, errorThrown)
{
    //Show the authentication UI
    $("#gscTab_GoogleSheetsArea").html(gscGetHtmlTemplate('gscTemplate_AuthenticationUi'));
}

//Called when an error has occured
function gscAjaxError(jqXHR, status, errorThrown)
{
    try
    {
        localAssert("ajax error: " + status + ", " + errorThrown);
    }
    catch(eCatch)
    {
        localAssert("error in ajax error processing");
    }
}

//AJAX callback object
//[dataIn] Data we got back from the request
function gscAjaxReturnSpreadsheetData(dataIn)
{
    var feed = dataIn.feed;
    localAssert(!gscIsNullOrUndefined(feed), "null feed returned")
    var entryArr = feed.entry;

    localAssert(!gscIsNullOrUndefined(entryArr), "null entry array")
    var htmlOut = "";

    //(May be blank) The OAuth access token to get the sheet's data
    var oAuthAccessToken = _gscAppState.getOAuthToken();

    //Look at each sheet in the workbook
    var entryArrLengh = entryArr.length;
    for (var idx = 0; idx < entryArrLengh; idx++)
    {
        htmlOut = htmlOut + gscGenerateHtmlFromGoogleWorkbookFeedSheetItem(entryArr[idx], oAuthAccessToken);
    }
    
    //Show links to download the data in the window
    var htmlAllSheets = gscReplaceAll(gscGetHtmlTemplate('gscTemplate_AllSheetsInfo'), "{{gscSheets}}", htmlOut);
    gscSetHtmlForResultsArea(htmlAllSheets);

    //Update the header text
    $("#gscArea_TopInfo").html(gscGetHtmlTemplate('gscTemplate_ConnectedToWorkbook'));

}

//Put this HTML into the results area
function gscSetHtmlForResultsArea(html)
{
    $("#gscTab_GoogleSheetsArea").html(html);
}

//Parse a Google feed entry item, generate HTML from it to show in a list of sheets
//[entryItem] Google Sheets sheet object
//[oAuthAccessToken] (optional) if specified, then append this as the access token to generated request URLs
function gscGenerateHtmlFromGoogleWorkbookFeedSheetItem(entryItem, oAuthAccessToken) {
    localAssert(!gscIsNullOrUndefined(entryItem), "null entry");

    //If there is an access token, then turn it into a query string parameter
    var accessTokenQueryParam = "";
    if (!gscIsEmptyString(oAuthAccessToken))
    {
        accessTokenQueryParam = "access_token=" + oAuthAccessToken;
    }

    //get the title
    var sheetTitle = entryItem.title.$t;

    //search for the link with the cells feed (can be turned to json) of the cell
    var urlCellsFeedNoAuth = gscSearchGoogleWorkbookFeedEntryItemsForContentLink(entryItem.link, 'cellsfeed');
    var urlCellsFeed = null;
    if (!gscIsEmptyString(urlCellsFeedNoAuth)) {
        //JSON version of the URL
        urlCellsFeedNoAuth = gscAppendQueryString(urlCellsFeedNoAuth, 'alt=json'); //Append any auth token, and a JSON indicator
        //Build a version of the URL with authentication appended (if we are using auth)
        urlCellsFeed = gscAppendQueryString(urlCellsFeedNoAuth, accessTokenQueryParam);
    }
    return gscGenerateHtmlForGoogleSheetLinks(sheetTitle, urlCellsFeed, urlCellsFeedNoAuth, oAuthAccessToken);
}

//Generate HTML buttons representing a Google Sheet download
// [title] : title of the shee
// [urlJsonCells] : Url to download the data
// [urlJsonCellsNoAuth] : Url to download the data, auth token appended
// [oAuthToken] : oAuth token
function gscGenerateHtmlForGoogleSheetLinks(
    title,
    urlJsonCells,
    urlJsonCellsNoAuth,
    oAuthToken)
{
    localAssert(!gscIsEmptyString(title), "no title");
    localAssert(!gscIsEmptyString(urlJsonCells), "no json download url");
    localAssert(!gscIsEmptyString(urlJsonCellsNoAuth), "no json download url");
    if (gscIsEmptyString(oAuthToken))
    {
        oAuthToken = "";
    }
    //We want a title that has no strange characters that will cause html/function param encoding problems
    var safeParamTitle = gscGenerateFunctionParamSafeLiteral(title);

    var htmlOut = gscGetHtmlTemplate('gscTemplate_SheetInfo');
    htmlOut = gscReplaceAll(htmlOut, "{{gscTitleAsParameter}}", safeParamTitle);
    htmlOut = gscReplaceAll(htmlOut, "{{gscTitle}}", gscHtmlEncode(title));
    htmlOut = gscReplaceAll(htmlOut, "{{gscJsonCellsUrl}}", urlJsonCells);
    htmlOut = gscReplaceAll(htmlOut, "{{gscJsonCellsUrlNoAuth}}", urlJsonCellsNoAuth);
    htmlOut = gscReplaceAll(htmlOut, "{{gscOAuthToken}}", oAuthToken);
    return htmlOut;
}

//Sanitize a string for use in a function parameter. Removes disallowed characters. 
//This does NOT guarantee reverseability of the string- rather it is a simple sanitizer
//[textIn] : text to clean up
function gscGenerateFunctionParamSafeLiteral(textIn)
{
    var textOut = textIn;
    textOut = gscReplaceAll(textOut, '"', ''); //Remove dobule quotes
    textOut = gscReplaceAll(textOut, "'", ''); //Remove single quotes
    textOut = gscReplaceAll(textOut, "\r", ''); //Remove carrage return
    textOut = gscReplaceAll(textOut, "\n", ''); //Remove newline
    return textOut;
}

//Looks through an array of entryItems, finds the one with the matching bookmark, and returns its href (url)
//[entryArr] Array of entry items
//[findSchemaBookmark] Schema bookmark to locate (e.g. 'listfeed')
//[appendToUrl] Additional data we want to append to the retuned URL
function gscSearchGoogleWorkbookFeedEntryItemsForContentLink(entryArr, findSchemaBookmark, appendToUrl)
{
    localAssert(!gscIsNullOrUndefined(entryArr), "null entry array")
    localAssert(!gscIsEmptyString(findSchemaBookmark), "empty search term");
    if (gscIsEmptyString(appendToUrl)) { appendToUrl = "";}

    var entryArrLengh = entryArr.length;
    var htmlOut = "";
    for (var idx = 0; idx < entryArrLengh; idx++) {
        var entryItem = entryArr[idx];
        //Look at the schema element and see if it matches what we are looking for
        var entryBookmark = gscGetBookmark(entryItem.rel);
        if(entryBookmark == findSchemaBookmark)
        {
            var urlOut = entryItem.href;
            if (gscIsEmptyString(urlOut))
            {
                localAssert(false, "missing href element");
                return "";
            }

            return urlOut + appendToUrl;
        }
    }

    return null;
}

//Look in a url that points to a google workbook and get the workbook id
// e.g. f('https://docs.google.com/spreadsheets/d/1lFtOr5F-SNPLzMCEnXSmrgbFacN1hNaH_NsdSvWYvww/edit#gid=622804733') --> '1lFtOr5F-SNPLzMCEnXSmrgbFacN1hNaH_NsdSvWYvww'
function gscGetGoogleWorkbookIdFromUrl(url)
{
    localAssert(!gscIsEmptyString(url), "empty url");
    var workbookId = null;

    //See if this is our preferred (most common) url format
    workbookId = gscGetGoogleWorkbookIdFromUrl_preferred(url);

    //If not found above, try another URL format (i beleive this one is returned for shared sheets that the user is not the author of)
    if(gscIsEmptyString(workbookId))
    {
        workbookId = gscGetGoogleWorkbookIdFromUrl_secondary(url);
    }

    localAssert(!gscIsEmptyString(workbookId), "empty workbook id");

    return workbookId;
}

//Helper function for gscGetGoogleWorkbookIdFromUrl
function gscGetGoogleWorkbookIdFromUrl_preferred(url)
{
    //Find th text after the marker
    var afterMarker = gscStringAfter(url, '/d/');

    if (gscIsEmptyString(afterMarker)) {
        return null; //Note found
    }

    //Find the text before the next slash
    var wbId = gscStringBefore(afterMarker, "/");

    if (gscIsEmptyString(wbId)) {
        localAssert(false, "marker not found");
        return "";
    }

    return wbId;
}

//Helper function for gscGetGoogleWorkbookIdFromUrl
function gscGetGoogleWorkbookIdFromUrl_secondary(url) {
    //It may be another type of URL with a value we support
    //e.g. https://spreadsheets.google.com/ccc?key=0AonYZs4MzlZbdEIycWhwSnNBSTBTUDl3WWdDSE1VbHc
    var asKeyParamValue = gscGetUrlQueryParameter("key", url);
    localAssert(!gscIsEmptyString(asKeyParamValue), "marker not found");
    return asKeyParamValue;
}

//URL for the workbook feed
//[workbookId] Google ID for the workbook
//[oAuthAccessToken] : OAuth access token to use to get the private spreadsheet data
function gscGenerateUrl_GoogleWorkbookFeed(workbookId, oAuthAccessToken)
{
    localAssert(!gscIsEmptyString(workbookId), "empty workbook id");

    var baseUrl = 'https://spreadsheets.google.com/feeds/worksheets/' + workbookId;
    var urlOut = baseUrl;

    //Authenticated URL w/access token
    if (!gscIsEmptyString(oAuthAccessToken))
    {
        //We need the /values, not the /basic.  /values has the field names as Json properties.
        /*        return 'https://spreadsheets.google.com/feeds/worksheets/'
                    + workbookId +
                    '/private/basic?alt=json&access_token=' + oAuthAccessToken;
        */
        return 'https://spreadsheets.google.com/feeds/worksheets/'
            + workbookId +
            '/private/values?alt=json&access_token=' + oAuthAccessToken;
    }

    //Public URL
    return 'https://spreadsheets.google.com/feeds/worksheets/'
        + workbookId +
        '/public/values?alt=json';
}

//===========================================================================
//===========================================================================
//UTILITY FUNCTIONS BELOW
//===========================================================================
//===========================================================================

//Looks up a parameter's value in the bookmark string
//[paramName] : parameter we are looking for
//[urlHash] : string with "#" and then values. If not specified, we will use the browser nav Url 
function getUrlHashParameter(paramName, urlHash)
{
    if (gscIsNullOrUndefined(urlHash))
    {
        urlHash = window.location.hash;
    }

    //Blank value?
    if (gscIsEmptyString(urlHash))
    {
        return "";
    }

    var paramEqualsText = paramName + "=";
    var findMarker = "&" + paramEqualsText;
    var idxMarker = urlHash.indexOf(findMarker);
    //If it's not in the middle of the string, perhaps its in the front
    if (idxMarker == -1)
    {
        findMarker = "#" + paramEqualsText;
        idxMarker = urlHash.indexOf(findMarker);

        if (idxMarker != 0)
        {
            return "";
        }
    }

    //Param plus rest of string
    var paramValueAndRest = urlHash.substring(idxMarker + findMarker.length);
    var paramValue;
    var idxParamSplit = paramValueAndRest.indexOf("&");
    if(idxParamSplit == -1)
    {
        paramValue = paramValueAndRest;
    }
    else //There is another parmameter after it.  Extract it
    {
        paramValue = paramValueAndRest.substring(0, idxParamSplit);
    }

    return paramValue;
}

//Returns the query parmater value
//[paramName] : parameter we are looking for
//[url] : url we are looking in
//e.g. f('http://foob/something?param2=yes&param3=no', "param2') --> 'yes'
function gscGetUrlQueryParameter(paramName, url)
{
    localAssert(!gscIsEmptyString(paramName), "Empty param");
    localAssert(!gscIsEmptyString(paramName), "Empty url");
    //trim any hash
    var idxHash = url.indexOf("#");
    if (idxHash == 0) return "";
    if (idxHash > 0)
    {
        url = url.substr(0, idxHash - 1);
    }

    var queryStr = gscStringAfter(url, "?");
    if(gscIsEmptyString(queryStr)) 
    {
        return "";
    }

    //Treat it like a hash and query that value
    return getUrlHashParameter(paramName, "#" + queryStr);
}


//Returns the URL without the hash or query string
// e.g. f('http://foo.com/somewhere?queryParams#bookmark') --> 'http://foo.com/somewhere'
function gscUrlTrimQueryAndHash(url)
{
    var urlOut = url;
    localAssert(!gscIsEmptyString(url), "missing url");
    //Trim out a '?' if it's in the URL
    var idxQuery = url.indexOf("?");
    if(idxQuery > 0)
    {
        urlOut = urlOut.substring(0, idxQuery);
    }

    var idxHash = url.indexOf("#");
    if (idxHash > 0) {
        urlOut = urlOut.substring(0, idxHash);
    }

    return urlOut;
}

//Appends a query string value to a query string. Prepends it with "?" if the url does not have a '?' aready.
//[existingQueryString] : Existing url
//[append] : Value to append
function gscAppendQueryString(baseUrl, append) {
    localAssert(!gscIsNullOrUndefined(baseUrl), "missing base");

    //Nothing to append? return the base
    if (gscIsEmptyString(append))
    {
        return baseUrl;
    }

    //If it has no query string yet, start one
    var idxQuestion = baseUrl.indexOf("?");
    if(idxQuestion == -1)
    {
        return baseUrl + "?" + append;
    }

    //Otherwise, append
    return baseUrl + "&" + append;
}

//Appends a name value parameter.
//[baseUrl] : string to append to
//[append] : Value to append
function gscAppendParameter(baseUrl, append) {
    //Nothing to append? return the base
    if (gscIsEmptyString(append)) {
        return baseUrl;
    }

    if (gscIsEmptyString(baseUrl))
    {
        return append;
    }

    //Otherwise, append
    return baseUrl + "&" + append;
}

//Simple text replace to perform ReplaceAll
// [html] text to do search/replace in
// [find] item to find
// [replace] item to replace it with
function gscReplaceAll(html, find, replace)
{
    localAssert(!gscIsEmptyString(html), "missing html");
    localAssert(!gscIsEmptyString(find), "missing find");
    if (gscIsEmptyString(replace)) { replace = ""; }

    //Degenerate case.
    if (find == replace) { return html;}

    var workingHtml = html;
    var idxFind;
    var lenFind = find.length;
    var lenReplace = replace.length;
    idxFind = workingHtml.indexOf(find);
    while(idxFind >= 0)
    {
        var textBefore = workingHtml.substring(0, idxFind);
        var textAfter = workingHtml.substring(idxFind + lenFind);
        workingHtml = textBefore + replace + textAfter;

        //Look for the next occurance
        idxFind = workingHtml.indexOf(find, idxFind + lenReplace);
    }

    return workingHtml;
}

var _gscHtmlTemplates = new Object(); //Stores the templates in memory
//Loads templates defined in our html document
//[htmlId] HTML ID of the template
function gscGetHtmlTemplate(htmlId)
{
    var cachedTemplate = _gscHtmlTemplates[htmlId];
    if(typeof cachedTemplate == 'undefined')
    {
        var loadedTemplate = $("#" + htmlId).html(); //Look up the element from our html document
        localAssert(!gscIsEmptyString(loadedTemplate), "template not found '" + htmlId + "'");

        //Store the template
        _gscHtmlTemplates[htmlId] = loadedTemplate;

        //Look up the template 
        return gscGetHtmlTemplate(htmlId);
    }

    return cachedTemplate;
}

//Turns text into HTML encoded
function gscHtmlEncode(value){
    return $('<div/>').text(value).html();
}

//Turns HTML into a text string
function gscHtmlDecode(value){
    return $('<div/>').html(value).text();
}
//Returns the bookmark part of a url
//e.g. f('http://www.foo.com/a#bc2') --> 'bc2'
function gscGetBookmark(url)
{
    localAssert(!gscIsEmptyString(url), "empty url");
    return gscStringAfter(url, '#');
}

//Finds the text after the marker
//[str] text to look in
//[findMarker] text to look for
function gscStringAfter(str, findMarker)
{
    localAssert(!gscIsNullOrUndefined(findMarker), "null marker");
    localAssert(findMarker.length > 0, "marker is 0 length");

    var idxFindStr = str.indexOf(findMarker);
    if (idxFindStr == -1) return "";
    return str.substring(idxFindStr + findMarker.length);
}

//Finds the text before the marker
//[str] text to look in
//[findMarker] text to look for
function gscStringBefore(str, find) {
    var idxFindStr = str.indexOf(find);
    if (idxFindStr == -1) return "";
    return str.substring(0, idxFindStr);
}

//TRUE if the object should be treated as null
function gscIsNullOrUndefined(obj)
{
    if (typeof obj == 'undefined') return true;
    if (obj == null) return true;
    return false;
}

function gscIsNumber(obj) {
    if (typeof obj != 'number') return false;
    return true;
}

//True if the object should not be considered a blank string
function gscIsEmptyString(obj)
{
    if (typeof obj == 'undefined') return true;
    if (obj == null) return true;

    return !(obj.length > 0);
}

//Assert
//[condition] TRUE if no assert
//[message] text to show
function localAssert(condition, message)
{
    if (condition == true) return;
    if (typeof tableau !== 'undefined') {
        tableau.abortWithError(message);
    } else {
        window.alert(message);
    }
}

//Try to update the UI with the connect information
//[urlGoogleSheet] URL to google sheet
function gscAttemptUiUpdateWithGoogleSheetUrl(urlGoogleSheet) {
    if (gscIsEmptyString(urlGoogleSheet)) {
        urlGoogleSheet = "";
    }

    try {
        //Eat the error -- even if we cannot update the UI
        _gscAppState.setGoogleWorkbookUrl(urlGoogleSheet);
    }
    catch (ex) {
        localAssert(false, "error updating HTML UI with connect data (non fatal - bug in WDC?)");
    }
}
